import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { useChunkedUsers } from '@folio/stripes-erm-components';

import { useDashboardAccessStore } from '../hooks';

import Loading from '../components/Loading';
import { isEqual } from 'lodash';

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
  const [dashboard, setDashboard] = useState({});
  const { data: _dashboard = {}, ...restOfDashboardQuery } = useQuery(
    ['ERM', 'Dashboard', dashId],
    () => ky(`servint/dashboard/${dashId}`).json().then((res) => {
      // Doing this in state to avoid render after isFetching is false,
      // but before dashboard is updated with correct data
      if (!isEqual(dashboard, res)) {
        setDashboard(res);
      }
      return res;
    }),
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
  // From the dashboard access, we need to fetch user information.
  // Batch fetch all users
  const { users, isLoading: areUsersLoading } = useChunkedUsers(dashboardUsers?.map(da => da?.user?.id), { enabled: !restOfDashboardUsersQuery?.isFetching && dashboardUsers.length });
  const mappedDashboardUsers = useMemo(() => (
    dashboardUsers.map(da => ({
      access: da.access.value, // Allow us to receive and send refdata value instead of id
      id: da.id,
      user: users.find(usr => usr.id === da.user.id) ?? da.user.id, // If this is a flat id then we know we couldn't find the user
    }))
  ), [dashboardUsers, users]);

  // If we're still loading the initial list of all dashboards for this user, show a loading screen
  if (dashboardsLoading) {
    return <Loading />;
  }

  // See top level index.js for how we pass this information down to lower routes
  return children({
    areUsersLoading,
    dashboardUsers: mappedDashboardUsers, // A list of the users for a given dashboard
    dashboardUsersQuery: restOfDashboardUsersQuery,
    dashboards,
    dashboard,
    dashboardQuery: restOfDashboardQuery,
    setDashboard
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
