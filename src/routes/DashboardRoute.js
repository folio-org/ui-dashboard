import React, { useState } from 'react';
import { stripesConnect } from '@folio/stripes/core';

import Dashboard from '../components/Dashboard/Dashboard.js';


const DashboardRoute = ({
  history,
  location,
  match: {
    params
  },
  resources: {
    dashboards: {
      records : dashboards = []
    } = {},
    dashboard: {
      records: {
        0: dashboard
      }
    }
  }
}) => {
  // WHILE LOADING DATA JUST RETURN OUT
  if (!dashboards.length) {
    return null;
  }
  const [dashName, setDashName] = useState(params.dashName ?? 'DEFAULT');

  if (location.pathname !== `/dashboard/${dashName}`) {
    history.push(`/dashboard/${dashName}${location.search}`);
  }

  // Check dashboard exists
  const dash = dashboards.find(d => d.name === params.dashName);
  if (dash) {
    return (
      <Dashboard
        dashboard={dashboard}
        onChangeDash={setDashName}
      />
    );
  }
  // TODO Clean up this error screen
  return <p> No dash with that name </p>;
};

export default stripesConnect(DashboardRoute);

DashboardRoute.manifest = Object.freeze({
  dashboards: {
    type: 'okapi',
    path: 'servint/dashboard/my-dashboards',
    shouldRefresh: () => false,
  },
  dashboard: {
    type: 'okapi',
    path: (_p, params, _r, _s, props) => {
      const { resources: {
        dashboards: {
          records : dashboards = []
        } = {}
      } } = props;
      const dash = dashboards.find(d => d.name === params.dashName);
      return dash ? `servint/dashboard/${dash.id}` : null;
    },
    shouldRefresh: () => true,
    throwErrors: false
  },
});
