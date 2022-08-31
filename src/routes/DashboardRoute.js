import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import Loading from '../components/Dashboard/Loading';
import Dashboard from '../components/Dashboard/Dashboard';

import { ErrorPage } from '../components/ErrorComponents';

const DashboardRoute = ({
  history,
  location,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  const [dashId, setDashId] = useState(params.dashId);

  const queryClient = useQueryClient();

  // Load specific dashboard -- for now will only be DEFAULT
  const { data: dashboard, isLoading: dashboardLoading } = useQuery(
    ['ERM', 'dashboard', dashId],
    () => ky(`servint/dashboard/${dashId}`).json(),
  );

  // Fetching widgets separately allows us to sort them by weighting on fetch, and maybe paginate later on if necessary
  const { data: widgets, isLoading: widgetsLoading } = useQuery(
    // We need this to rerun when the dashboard updates
    ['ui-dashboard', 'dashboardRoute', 'widgets', dashboard],
    () => ky(`servint/dashboard/${dashId}/widgets?sort=weight;asc&perPage=100`).json(),
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
    ['ui-dashboard', 'dashboardRoute', 'deleteWidget'],
    (widgetId) => ky.delete(`servint/widgets/instances/${widgetId}`)
  );

  const handleCreate = () => {
    history.push(`${location.pathname}/create`);
  };

  const handleReorder = () => {
    history.push(`${location.pathname}/editOrder`);
  };

  const handleUserAccess = () => {
    history.push(`${location.pathname}/userAccess`);
  };

  const handleWidgetEdit = (id) => {
    history.push(`${location.pathname}/${id}/edit`);
  };

  const handleWidgetDelete = (id) => {
    deleteWidget(id).then(() => (
      // Make sure to refetch dashboard when we delete a widget
      queryClient.invalidateQueries(['ERM', 'dashboard', dashId])
    ));
  };

  if (dashboardLoading || widgetsLoading) {
    return <Loading />;
  }

  if (dashboard) {
    return (
      <Dashboard
        key={`dashboard-${dashboard.id}`}
        dashboardId={dashboard.id}
        onChangeDash={setDashId}
        onCreate={handleCreate}
        onReorder={handleReorder}
        onUserAccess={handleUserAccess}
        onWidgetDelete={handleWidgetDelete}
        onWidgetEdit={handleWidgetEdit}
        widgets={widgets}
      />
    );
  }

  return (
    <ErrorPage>
      <FormattedMessage id="ui-dashboard.error.noDashWithThatName" values={{ name: dashboard?.name }} />
    </ErrorPage>
  );
};

export default DashboardRoute;

DashboardRoute.propTypes = {
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
