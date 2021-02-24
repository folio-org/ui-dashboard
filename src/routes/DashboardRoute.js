import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import Dashboard from '../components/Dashboard/Dashboard';

const DashboardRoute = ({
  history,
  location,
  match: {
    params
  }
}) => {
  /*
   * IMPORTANT this code uses react-query.
   * At some point after Stripes' Iris release there is a possibility this will be removed in favour of SWR.
   * A decision has not been made either way yet, so for now I've gone with react-query.
   * Should that happen, the APIs seem quite similar so porting won't be too difficult.
   */

  const ky = useOkapiKy();
  // At some point we might have a select for different dashboards here, hence this generic call as well as the specific one
  const { data: dashboards = [], isLoading: dashboardsLoading, isSuccess: isDashboardsSuccess } = useQuery(
    ['ui-dashboard', 'dashboardRoute', 'dashboards'],
    () => ky('servint/dashboard/my-dashboards').json()
  );

  const [dashName, setDashName] = useState(params.dashName || 'DEFAULT');

  useEffect(() => {
    if (location.pathname !== `/dashboard/${dashName}`) {
      history.push(`/dashboard/${dashName}`);
    }
  }, [history, location.pathname, dashName]);

  // Load specific dashboard -- for now will only be DEFAULT
  const { data: { 0: dashboard } = [], isLoading: dashboardLoading } = useQuery(
    ['ui-dashboard', 'dashboardRoute', 'dashboard'],
    () => ky(`servint/dashboard/my-dashboards?filters=name=${dashName}`).json(),
    {
      /* Only run this query if the dashboards query has already run.
       * This is for the first fetch, where the backend will create the user record
       * (after this it can resolve to that entity)
       * We need to know that is complete before we make a second call,
       * to ensure we're not attempting to create the same userRecord again
      */
      enabled: isDashboardsSuccess
    }
  );

  // DASHBOARD DEFAULT SHOULD BE CREATED AUTOMATICALLY BUT MIGHT TAKE MORE THAN ONE RENDER CYCLE
  if (dashboardsLoading || !dashboards.length) {
    return null;
  }

  const handleCreate = () => {
    history.push(`${location.pathname}/create`);
  };

  if (dashboardLoading) {
    // TODO Clean up this loading screen
    return <p> DASHBOARD LOADING </p>;
  }

  if (dashboard) {
    return (
      <Dashboard
        key={`dashboard-${dashboard.id}`}
        dashboard={dashboard}
        onChangeDash={setDashName}
        onCreate={handleCreate}
      />
    );
  }
  // TODO Clean up this error screen
  return <p> No dash with that name </p>;
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
