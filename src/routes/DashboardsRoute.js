import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import Loading from '../components/Loading';
import { useDashboardAccessStore } from '../components/hooks';

const DashboardsRoute = ({
  children,
  history,
  match: {
    params
  } = {}
}) => {
  const { dashId } = useParams();
  const stripes = useStripes();

  const ky = useOkapiKy();

  const myDashboardsQueryParams = useMemo(() => (
    generateKiwtQueryParams(
      {
        sort: [
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
    ['ERM', 'Dashboards', myDashboardsQueryParams],
    () => ky(`servint/dashboard/my-dashboards?${myDashboardsQueryParams.join('&')}`).json()
  );

  useEffect(() => {
    if (!dashboardsLoading && dashboards && !params.dashId) {
      /* Once dashboards have loaded, push user to their default,
       * or failing that the first dashboard in list
       */
      const pushDashboard = dashboards?.find(dshb => !!dshb.defaultUserDashboard) ?? dashboards[0];

      history.push(`/dashboard/${pushDashboard?.dashboard?.id}`);
    }
  }, [dashboards, history, dashboardsLoading, params.dashId]);


  /*
   * The three fetches below represent 2 different ways of getting data to send to the components
   *
   * Firstly we have a zustand store, which sets access against a given dashId,
   * allowing any component then to call a hook and fetch that information
   *
   * The other two calls fetch information, which we then prop drill to the other
   * routes. We could switch these ALL to being zustand stores, meaning that any given
   * component can grab this data from a hook.
   *
   * However for now prop drilling will suffice
   */

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

  // If and only if we're within a route containing a dashId, fetch the dashboard
  const { data: dashboard = {}, ...restOfDashboardQuery } = useQuery(
    ['ERM', 'Dashboard', dashId],
    () => ky(`servint/dashboard/${dashId}`).json(),
    {
      enabled: !!dashId
    }
  );

  // If and only if we're within a route containing a dashId, fetch the dashboard users
  const { data: dashboardUsers = [], ...restOfDashboardUsersQuery } = useQuery(
    ['ERM', 'Dashboard', 'Users', dashId],
    () => ky(`servint/dashboard/${dashId}/users`).json(),
    {
      enabled: !!dashId
    }
  );


  // If we're still loading the initial list of all dashboards for this user, show a loading screen
  if (dashboardsLoading) {
    return <Loading />;
  }

  // See top level index.js for how we pass this information down to lower routes
  return children({
    dashboardUsers, // A list of the users for a given dashboard
    dashboardUsersQuery: restOfDashboardUsersQuery,
    dashboards,
    dashboard,
    dashboardQuery: restOfDashboardQuery
  });
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      dashId: PropTypes.string
    })
  }).isRequired
};
