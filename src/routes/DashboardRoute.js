import React, { useState } from 'react';
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
  const { data: dashboards, status: dashboardsStatus } = useQuery(
    ['dashboardRoute', 'dashboards'],
    () => ky('servint/dashboard/my-dashboards').json()
  );

  const [dashName, setDashName] = useState(params.dashName ?? 'DEFAULT');

  // Load specific dashboard -- for now will only be DEFAULT
  const { data: {0: dashboard} = [], status: dashboardStatus } = useQuery(
    ['dashboardRoute', 'dashboard'],
    () => ky(`servint/dashboard/my-dashboards?filters=name=${params.dashName}`).json()
  );

    
  // DASHBOARD DEFAULT SHOULD BE CREATED AUTOMATICALLY BUT MIGHT TAKE MORE THAN ONE RENDER CYCLE
  if (dashboardsStatus === 'loading' || !dashboards.length) {
    return null;
  }

  if (location.pathname !== `/dashboard/${dashName}`) {
    history.push(`/dashboard/${dashName}${location.search}`);
  }

  const handleCreate = () => {
    history.push(`${location.pathname}/create${location.search}`);
  };

  if (dashboardStatus === 'loading') {
    // TODO Clean up this loading screen
    return <p> DASHBOARD LOADING </p>
  }

  if (dashboard) {
    return (
      <Dashboard
        dashboard={dashboard}
        key={`dashboard-${dashboard.id}`}
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
