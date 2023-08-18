/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */
import { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  ConfirmationModal,
} from '@folio/stripes/components';

import Header from './Header';
import css from './DashboardContainer.css';
import Dashboard, { NoWidgets } from '../Dashboard';

import { ErrorModal } from '../ErrorComponents';
import DashboardAccessInfo from '../DashboardAccessInfo/DashboardAccessInfo';

const DashboardContainer = ({
  dashboard,
  dashboards,
  onCreateDashboard,
  onCreateWidget,
  onDeleteDashboard,
  onEdit,
  onManageDashboards,
  onReorder,
  onUserAccess,
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
    errorMessage: null,
    errorModalOpen: false,
    errorStack: null
  });

  // This takes an error and a stacktrace to pass to the modal, and opens it
  const handleError = useCallback((err, stack) => {
    setErrorState({
      ...errorState,
      errorMessage: err,
      errorModalOpen: true,
      errorStack: stack
    });
  }, [errorState]);

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

  const dashboardContents = () => {
    if (!widgets?.length) {
      return (
        <NoWidgets />
      );
    }

    return (
      <Dashboard
        handleError={handleError}
        onWidgetEdit={onWidgetEdit}
        setupConfirmationModal={setupConfirmationModal}
        widgets={widgets}
      />
    );
  };

  return (
    <>
      <div className={css.dashboardContainer}>
        <Header
          key={`dashboard-header-${dashboard.id}`}
          dashboard={dashboard}
          dashboards={dashboards}
          onCreateDashboard={onCreateDashboard}
          onCreateWidget={onCreateWidget}
          onDeleteDashboard={onDeleteDashboard}
          onEdit={onEdit}
          onManageDashboards={dashboards?.length > 1 ? onManageDashboards : null}
          onReorder={widgets?.length > 1 ? onReorder : null}
          onUserAccess={onUserAccess}
        />
        <div className={css.dashboardContent}>
          <DashboardAccessInfo dashId={dashboard.id} />
          {dashboardContents()}
        </div>
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-dashboard.delete" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-dashboard.dashboard.deleteWidget" />}
          id="delete-agreement-confirmation"
          message={
            <FormattedMessage
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
        <ErrorModal
          handlers={{
            onHideModal: handleHideModal
          }}
          message={errorState.errorMessage}
          modalOpen={errorState.errorModalOpen}
          stack={errorState.errorStack}
        />
      </div>
    </>
  );
};

export default DashboardContainer;
DashboardContainer.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  dashboards: PropTypes.arrayOf(PropTypes.shape({
    dashboard: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  onCreateDashboard: PropTypes.func.isRequired,
  onCreateWidget: PropTypes.func.isRequired,
  onDeleteDashboard: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onManageDashboards: PropTypes.func.isRequired,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
