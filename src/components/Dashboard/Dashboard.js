import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { ConfirmationModal } from '@folio/stripes/components';

import DashboardHeader from './DashboardHeader';
import NoWidgets from './NoWidgets';

import css from './Dashboard.css';

import { Widget } from '../Widget';

import useWidgetDefinition from '../useWidgetDefinition';

const propTypes = {
  dashboardId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object)
};

const Dashboard = ({ dashboardId, onCreate, onReorder, onWidgetDelete, onWidgetEdit, widgets }) => {
  // Handle delete through a delete confirmation modal rather than directly
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  // Keep track of which widget we're deleting--necessary because this is the dashboard level
  const [widgetToDelete, setWidgetToDelete] = useState({});


  const setupConfirmationModal = (widgetId, widgetName) => {
    // Hijack the onDelete function to show confirmation modal instead at this level
    setShowDeleteConfirmationModal(true);
    setWidgetToDelete({ name: widgetName, id: widgetId });
  };

  const RenderWidget = ({ widget }) => {
    const {
      specificWidgetDefinition,
      componentBundle: {
        WidgetComponent
      }
    } = useWidgetDefinition(widget.definition?.name, widget.definition?.version);

    return (
      <Widget
        key={`widget-${widget.id}`}
        onWidgetDelete={setupConfirmationModal}
        onWidgetEdit={onWidgetEdit}
        widget={widget}
      >
        <WidgetComponent
          key={`${specificWidgetDefinition?.typeName}-${widget.id}`}
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
        version: PropTypes.string.isRequired
      }).isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  };

  const dashboardContents = () => {
    if (!widgets?.length) {
      return <NoWidgets />;
    }
    return (
      <div className={css.widgetContainer}>
        {widgets.map(w => <RenderWidget widget={w} />)}
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
        <div className={css.dashboardContent}>
          {dashboardContents()}
        </div>
      </div>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-dashboard.dashboard.delete" />}
        data-test-delete-confirmation-modal
        heading={<FormattedMessage id="ui-dashboard.dashboard.deleteWidget" />}
        id="delete-agreement-confirmation"
        message={<SafeHTMLMessage id="ui-dashboard.dashboard.deleteWidgetConfirmMessage" values={{ name: widgetToDelete.name }} />}
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
