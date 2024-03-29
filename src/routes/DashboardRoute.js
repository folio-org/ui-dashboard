import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCallout, useOkapiKy } from '@folio/stripes/core';
import {
  ConfirmationModal,
} from '@folio/stripes/components';

import Loading from '../components/Loading';
import DashboardContainer from '../components/DashboardContainer';

import { ErrorPage } from '../components/ErrorComponents';

const DashboardRoute = ({
  dashboard,
  dashboardQuery: {
    isFetching: dashboardLoading,
  },
  dashboards,
  dashboardUsers = [],
  history,
  location,
  match: {
    params
  },
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const callout = useCallout();

  const [deleteDashboardModal, setDeleteDashboardModal] = useState(false);

  // Fetching widgets separately allows us to sort them by weighting on fetch, and maybe paginate later on if necessary
  const { data: widgets, isLoading: widgetsLoading } = useQuery(
    // We need this to rerun when the dashboard updates
    ['ERM', 'Dashboard', params.dashId, 'Widgets'],
    () => ky(`servint/dashboard/${params.dashId}/widgets?sort=weight;asc&perPage=100`).json(),
    {
      /* Once the dashboard has been fetched, we can then fetch the ordered list of widgets from it */
      enabled: (
        dashboardLoading !== true &&
        dashboard?.id !== null
      )
    }
  );

  // The DELETE for the widgets
  const { mutateAsync: deleteWidget } = useMutation(
    ['ERM', 'Dashboard', params.dashId, 'deleteWidget'],
    (widgetId) => ky.delete(`servint/widgets/instances/${widgetId}`).then(() => (
      // Make sure to refetch dashboard when we delete a widget
      queryClient.invalidateQueries(['ERM', 'Dashboard', params.dashId])
    ))
  );

  // The DELETE for the dashboard itself
  const { mutateAsync: deleteDashboard } = useMutation(
    ['ERM', 'Dashboard', 'deleteDashboard'],
    () => ky.delete(`servint/dashboard/${params.dashId}`)
      .then(() => {
        callout.sendCallout({ message: <FormattedMessage id="ui-dashboard.dashboard.delete.success" values={{ dashboardName: dashboard.name }} /> });
        queryClient.invalidateQueries(['ERM', 'Dashboards']);
      })
  );

  const handleCreateWidget = () => {
    history.push(`${location.pathname}/createWidget`);
  };

  const handleReorder = () => {
    history.push(`${location.pathname}/editOrder`);
  };

  const handleUserAccess = () => {
    history.push(`${location.pathname}/userAccess`);
  };

  const handleManageDashboards = () => {
    history.push(`${location.pathname}/manageDashboards`);
  };

  const handleDashboardEdit = () => {
    history.push(`${location.pathname}/edit`);
  };

  const handleCreateDashboard = () => {
    history.push(`${location.pathname}/create`);
  };

  const handleWidgetEdit = (id) => {
    history.push(`${location.pathname}/${id}/edit`);
  };

  if (dashboardLoading || widgetsLoading) {
    return <Loading />;
  }

  if (!Object.keys(dashboard).length) {
    return (
      <ErrorPage>
        <FormattedMessage id="ui-dashboard.error.noDashWithThatName" values={{ name: dashboard?.name }} />
      </ErrorPage>
    );
  }

  return (
    <>
      <DashboardContainer
        key={`dashboard-${dashboard.id}`}
        dashboard={dashboard}
        dashboards={dashboards}
        onCreateDashboard={handleCreateDashboard}
        onCreateWidget={handleCreateWidget}
        onDeleteDashboard={() => setDeleteDashboardModal(true)}
        onEdit={handleDashboardEdit} // This is to send the user to the edit ROUTE
        onManageDashboards={handleManageDashboards}
        onReorder={handleReorder}
        onUserAccess={handleUserAccess}
        onWidgetDelete={deleteWidget}
        onWidgetEdit={handleWidgetEdit}
        widgets={widgets}
      />
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-dashboard.delete" />}
        data-test-delete-confirmation-modal
        heading={
          <FormattedMessage
            id="ui-dashboard.deleteDashboardHeader"
            values={{ name: dashboard.name }}
          />}
        id="delete-dashboard-confirmation"
        message={dashboardUsers?.length > 1 ?
          <>
            <FormattedMessage
              id="ui-dashboard.deleteDashboard.messageMultiUsers"
              values={{ name: dashboard.name }}
            />
          </> :
          <FormattedMessage
            id="ui-dashboard.deleteDashboard.message"
            values={{ name: dashboard.name }}
          />
        }
        onCancel={() => {
          setDeleteDashboardModal(false);
        }}
        onConfirm={() => {
          deleteDashboard();
          history.push('/dashboard');
        }}
        open={deleteDashboardModal}
      />
    </>
  );
};

export default DashboardRoute;

DashboardRoute.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }),
  dashboardQuery: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
  }),
  dashboardUsers: PropTypes.arrayOf(PropTypes.object),
  dashboards: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      dashId: PropTypes.string
    })
  }).isRequired
};
