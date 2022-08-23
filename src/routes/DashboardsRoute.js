import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useQuery } from 'react-query';
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
  // At some point we might have a select for different dashboards here, hence this generic call as well as the specific one
  const [isInitialDashFinished, setInitialDashFinished] = useState(false);
  const { data: dashboards, isLoading: dashboardsLoading } = useQuery(
    ['ui-dashboard', 'dashboardRoute', 'dashboards'],
    async () => {
      // Actually wait for the data to come back.
      const dashData = await ky('servint/dashboard/my-dashboards').json();
      setInitialDashFinished(true);
      return dashData;
    }
  );

  useEffect(() => {
    if (isInitialDashFinished && dashboards) {
      /*
       * NOTE this simply pushes the user to the first dashboard in their list,
       * which initially should only be a single dashboard, DEFAULT
       */
      const dashName = dashboards[0]?.name;
      history.push(`/dashboard/${dashName}`);
    }
  }, [dashboards, history, isInitialDashFinished]);

  if (dashboardsLoading) {
    return <Loading />;
  }

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
