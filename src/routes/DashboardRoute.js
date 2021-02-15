import React, { useState } from 'react';
import { stripesConnect } from '@folio/stripes/core';
import PropTypes from 'prop-types';

import Dashboard from '../components/Dashboard/Dashboard';


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
  const [dashName, setDashName] = useState(params.dashName ?? 'DEFAULT');

  // WHILE LOADING DATA JUST RETURN OUT
  if (!dashboards.length) {
    return null;
  }

  if (location.pathname !== `/dashboard/${dashName}`) {
    history.push(`/dashboard/${dashName}${location.search}`);
  }

  const handleCreate = () => {
    history.push(`${location.pathname}/create${location.search}`);
  };

  // Check dashboard exists
  const dash = dashboards.find(d => d.name === params.dashName);
  if (dash) {
    return (
      <Dashboard
        dashboard={dashboard}
        onChangeDash={setDashName}
        onCreate={handleCreate}
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
      if (props.resources?.dashboards?.records?.length) {
        return `servint/dashboard/my-dashboards?filters=name=${params.dashName}`;
      }
      return null;
    },
    shouldRefresh: () => true,
    throwErrors: false
  },
});

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
  }).isRequired,
  resources: PropTypes.shape({
    dashboards: PropTypes.object,
    dashboard: PropTypes.object
  })
};
