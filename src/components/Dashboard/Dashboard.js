import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import SafeHTMLMessage from '@folio/react-intl-safe-html';
import {
  ConfirmationModal,
  Modal,
  ModalFooter,
  Button,
  Headline,
  Icon,
} from '@folio/stripes/components';


import DashboardHeader from './DashboardHeader';
import NoWidgets from './NoWidgets';
import css from './Dashboard.css';
import { Widget } from '../Widget';
import useWidgetDefinition from '../useWidgetDefinition';
import ErrorMessage from './DashboardErrorBanner/ErrorMessage';

const propTypes = {
  dashboardId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};

const Dashboard = ({
  dashboardId,
  onCreate,
  onReorder,
  onWidgetDelete,
  onWidgetEdit,
  widgets
}) => {
  // Handle delete through a delete confirmation modal rather than directly
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  // Keep track of which widget we're deleting--necessary because this is the dashboard level
  const [widgetToDelete, setWidgetToDelete] = useState({});

  // This stores the CANVAS-LEVEL error state, ready to display in the modal
  const [errorState, setErrorState] = useState({
    errorCopied: false,
    errorMessage: null,
    errorModalOpen: false,
    errorStack: null
  });

  const copyRef = useRef(null);
  const intl = useIntl();

  // This takes an error and a stacktrace to pass to the modal, and opens it
  const handleError = (err, stack) => {
    setErrorState({
      ...errorState,
      errorMessage: err,
      errorModalOpen: true,
      errorStack: stack
    });
  };

  const handleHideModal = () => {
    setErrorState({
      ...errorState,
      errorModalOpen: false
    });
  };

  const setupConfirmationModal = (widgetId, widgetName) => {
    // Hijack the onDelete function to show confirmation modal instead at this level
    setShowDeleteConfirmationModal(true);
    setWidgetToDelete({ name: widgetName, id: widgetId });
  };

  const handleCopyStack = () => {
    const el = copyRef.current;
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');

    setErrorState({
      ...errorState,
      errorCopied: true
    });
  };

  const RenderWidget = ({ widget }) => {
    const {
      specificWidgetDefinition,
      componentBundle: { WidgetComponent },
    } = useWidgetDefinition(
      widget.definition?.name,
      widget.definition?.version
    );

    useEffect(() => {
      let timeout;
      if (errorState.errorCopied) {
        timeout = setTimeout(() => {
          setErrorState({
            ...errorState,
            errorCopied: false
          });
        }, 1000);
      }
      return () => {
        clearTimeout(timeout);
      };
    }, []);



    return (
      <Widget
        onWidgetDelete={setupConfirmationModal}
        onWidgetEdit={onWidgetEdit}
        widget={widget}
      >
        <WidgetComponent
          key={`${specificWidgetDefinition?.typeName}-${widget.id}`}
          onError={handleError}
          widget={widget}
          widgetDef={specificWidgetDefinition?.definition}
        />
      </Widget>
    );
  };

  RenderWidget.propTypes = {
    widget: PropTypes.shape({
      definition: PropTypes.shape({
        name: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  const dashboardContents = () => {
    if (!widgets?.length) {
      return <NoWidgets />;
    }
    return (
      <div className={css.widgetsContainer}>
        {widgets.map(w => (
          <RenderWidget
            key={`widget-${w.id}`}
            widget={w}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={css.dashboard}>
        <DashboardHeader
          key={`dashboard-header-${dashboardId}`}
          onCreate={onCreate}
          onReorder={onReorder}
        />
        <div className={css.dashboardContent}>{dashboardContents()}</div>
      </div>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-dashboard.dashboard.delete" />}
        data-test-delete-confirmation-modal
        heading={<FormattedMessage id="ui-dashboard.dashboard.deleteWidget" />}
        id="delete-agreement-confirmation"
        message={
          <SafeHTMLMessage
            id="ui-dashboard.dashboard.deleteWidgetConfirmMessage"
            values={{ name: widgetToDelete.name }}
          />
        }
        onCancel={() => {
          setShowDeleteConfirmationModal(false);
          setWidgetToDelete({});
        }}
        onConfirm={() => {
          onWidgetDelete(widgetToDelete.id);
          setShowDeleteConfirmationModal(false);
          setWidgetToDelete({});
        }}
        open={showDeleteConfirmationModal}
      />
      {/* MOVE THIS TO ANOTHER COMPONENT -> GENERAL REFACTORING */}
      <Modal
        closeOnBackgroundClick
        dismissible
        footer={
          <ModalFooter>
            <Button
              buttonStyle="primary"
              marginBottom0
              onClick={handleHideModal}
            >
              <FormattedMessage id="ui-dashboard.dashboard.close" />
            </Button>
            <Button
              buttonStyle="default"
              disabled={errorState.errorCopied}
              marginBottom0
              onClick={handleCopyStack}
            >
              <Icon icon="clipboard">
                {errorState.errorCopied ? (
                  <FormattedMessage id="ui-dashboard.dashboard.copied" />
                ) : (
                  <FormattedMessage id="ui-dashboard.dashboard.copy" />
                )}
              </Icon>
            </Button>
          </ModalFooter>
        }
        label={<FormattedMessage id="ui-dashboard.dashboard.errorDetails" />}
        onClose={handleHideModal}
        open={errorState.errorModalOpen}
        size="medium"
      >
        <Headline size="medium">
          <FormattedMessage id="ui-dashboard.dashboard.errorDetailsDescription" />
        </Headline>
        <ErrorMessage
          error={errorState.errorMessage}
          stack={errorState.errorStack}
        />
        {/* Hidden textfield to hold error text for copying */}
        <textarea
          ref={copyRef}
          aria-hidden
          className="sr-only"
          defaultValue={`URL: ${window.location.href}\n\nError: ${errorState.errorMessage}\n\nStack: ${errorState.errorStack}`}
        />
      </Modal>
    </>
  );
};

export default Dashboard;
Dashboard.propTypes = propTypes;
