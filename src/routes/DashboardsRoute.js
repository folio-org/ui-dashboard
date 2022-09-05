import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery } from 'react-query';
import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { useOkapiKy } from '@folio/stripes/core';

import Loading from '../components/Dashboard/Loading';
import { ErrorPage } from '../components/ErrorComponents';

const DashboardsRoute = ({
  history,
}) => {
  /*
   * IMPORTANT this code uses react-query.
   * At some point after Stripes' Iris release there is a possibility this will be removed in favour of SWR.
   * A decision has not been made either way yet, so for now I've gone with react-query.
   * Should that happen, the APIs seem quite similar so porting won't be too difficult.
   */

  const ky = useOkapiKy();
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

  // TODO We maybe need a container here to hold the tab options between dashboards

  // If finished loading and we have no dashboards, error out
  return (
    <ErrorPage>
      <FormattedMessage id="ui-dashboard.error.noDashboardsForUser" />
    </ErrorPage>
  );
};

export default DashboardsRoute;

DashboardsRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};
