import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery, useMutation } from 'react-query';
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
  const [dashName, setDashName] = useState(params.dashName);

  // Load specific dashboard -- for now will only be DEFAULT
  const [isInitialCallFinished, setInitialCallFinished] = useState(false);
  const { data: { 0: dashboard } = [], isLoading: dashboardLoading, refetch: refetchDashboard } = useQuery(
    ['ui-dashboard', 'dashboardRoute', 'dashboard'],
    async () => {
      // Actually wait for the data to come back.
      const dashData = await ky(`servint/dashboard/my-dashboards?filters=name=${dashName}`).json();
      setInitialCallFinished(true);
      return dashData;
    }
  );

  // Fetching widgets separately allows us to sort them by weighting on fetch, and maybe paginate later on if necessary
  const { data: widgets, isLoading: widgetsLoading } = useQuery(
    // We need this to rerun when the dashboard updates
    ['ui-dashboard', 'dashboardRoute', 'widgets', dashboard],
    () => ky(`servint/widgets/instances/my-widgets?filters=owner.id=${dashboard?.id}&sort=weight;asc&perPage=100`).json(),
    {
      /* Once the dashboard has been fetched, we can then fetch the ordered list of widgets from it */
      enabled: (
        isInitialCallFinished &&
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

  const handleWidgetEdit = (id) => {
    history.push(`${location.pathname}/${id}/edit`);
  };

  const handleWidgetDelete = (id) => {
    deleteWidget(id).then(() => (
      // Make sure to refetch dashboard when we delete a widget
      refetchDashboard()
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
        onChangeDash={setDashName}
        onCreate={handleCreate}
        onReorder={handleReorder}
        onWidgetDelete={handleWidgetDelete}
        onWidgetEdit={handleWidgetEdit}
        widgets={widgets}
      />
    );
  }
  return (
    <ErrorPage>
      <FormattedMessage id="ui-dashboard.error.noDashWithThatName" values={{ name: dashName }} />
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
      dashName: PropTypes.string
    })
  }).isRequired
};
