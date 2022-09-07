import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';

import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import Loading from '../components/Loading';
// import { ErrorPage } from '../components/ErrorComponents';
import { useDashboardAccessStore } from '../components/hooks';

const DashboardsRoute = ({
  children,
  history,
}) => {
  const { dashId } = useParams();
  const stripes = useStripes();

  const ky = useOkapiKy();

  // If and only if we're within a route containing a dashId, fill out access in zustand store
  const setAccess = useDashboardAccessStore(state => state.setAccess);
  useQuery(
    ['ui-dashboard', 'dashboardRoute', 'my-access', dashId],
    () => ky(`servint/dashboard/${dashId}/my-access`).json()
      .then(res => {
        setAccess(dashId, res.access, stripes.hasPerm('servint.dashboards.admin'));
      }),
    {
      enabled: !!dashId
    }
  );

  const myDashboardsQueryParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        sort: [
          {
            path: 'defaultUserDashboard',
            direction: 'desc'
          },
          {
            path: 'userDashboardWeight'
          },
          {
            path: 'dateCreated',
            direction: 'desc'
          }
        ],
        stats: false
      },
      {}
    )
  ), []);

  // At some point we might have a select for different dashboards here, hence this generic call as well as the specific one
  // For now ensure we always get the dashboards back from earliest to latest
  const { data: dashboards, isLoading: dashboardsLoading } = useQuery(
    ['ERM', 'dashboards', myDashboardsQueryParams],
    () => ky(`servint/dashboard/my-dashboards?${myDashboardsQueryParams.join('&')}`).json()
  );

  useEffect(() => {
    if (!dashboardsLoading && dashboards) {
      /*
       * NOTE this simply pushes the user to the first dashboard in their list,
       * which initially should only be a single dashboard, DEFAULT
       */
      history.push(`/dashboard/${dashboards[0]?.dashboard?.id}`);
    }
  }, [dashboards, history, dashboardsLoading]);

  if (dashboardsLoading) {
    return <Loading />;
  }

  // See top level index.js for how we pass this information down to lower routes
  return children({ dashboards });

  /*
    The following code is relevant for the future splash screen implementation?
    // If finished loading and we have no dashboards, error out
    return (
      <ErrorPage>
        <FormattedMessage id="ui-dashboard.error.noDashboardsForUser" />
      </ErrorPage>
    );
  */
};

export default DashboardsRoute;

DashboardsRoute.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};
