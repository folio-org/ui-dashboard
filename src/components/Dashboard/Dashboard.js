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
  SRStatus,
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
  onCopyError: PropTypes.func,
  stackTrace: PropTypes.string,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
const Dashboard = ({
  dashboardId,
  onCreate,
  onReorder,
  onWidgetDelete,
  onWidgetEdit,
  widgets,
  onCopyError,
  stackTrace,
}) => {
  // Handle delete through a delete confirmation modal rather than directly
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  // Keep track of which widget we're deleting--necessary because this is the dashboard level
  const [widgetToDelete, setWidgetToDelete] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCopied, setErrorCopied] = useState(false);

  const intl = useIntl();
  const copyRef = useRef(null);
  const srsRef = useRef(null);

  const handleShowModal = (errorMessage) => {
    setErrorMessage(errorMessage);
  };
  const handleHideModal = () => {
    setErrorMessage('');
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
    if (typeof onCopyError === 'function') {
      onCopyError(el.defaultValue);
    }
    srsRef.current.sendMessage(
      intl.formatMessage({
        id: 'stripes-components.ErrorBoundary.errorCopiedScreenReaderMessage',
      })
    );
    setErrorCopied(true);
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
      if (errorCopied) {
        timeout = setTimeout(() => {
          setErrorCopied(false);
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
          onShowModal={(errorMessage) => handleShowModal(errorMessage)}
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
        <FormattedMessage id="ui-dashboard.dashboard.errorDetails">
          {([modalLabel]) => (
            <Modal
              aria-label={modalLabel}
              closeOnBackgroundClick
              contentClass={css.modalContent}
              data-test-error-boundary-production-error-details-modal
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
                    aria-label={intl.formatMessage({
                      id: 'ui-dashboard.dashboard.copyErrorButtonAriaLabel.copyErrorButtonAriaLabel',
                    })}
                    buttonStyle="default"
                    data-test-error-boundary-production-error-copy-button
                    disabled={errorCopied}
                    marginBottom0
                    onClick={handleCopyStack}
                  >
                    <Icon icon="clipboard">
                      {errorCopied ? (
                        <FormattedMessage id="ui-dashboard.dashboard.copied" />
                      ) : (
                        <FormattedMessage id="ui-dashboard.dashboard.copy" />
                      )}
                    </Icon>
                  </Button>
                </ModalFooter>
              }
              label={modalLabel}
              onClose={handleHideModal}
              open={errorMessage}
              size="medium"
            >
              <SRStatus ref={srsRef} />
              <Headline size="medium">
                <FormattedMessage id="ui-dashboard.dashboard.errorDetailsDescription" />
              </Headline>
              <ErrorMessage
                data-test-error-boundary-production-error-message
                error={errorMessage}
                stack={stackTrace}
              />
            </Modal>
          )}
        </FormattedMessage>
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
    </>
  );
};
export default Dashboard;
Dashboard.propTypes = propTypes;
