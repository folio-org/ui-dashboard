import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { useDashboardAccessStore } from '../components/hooks';

// This contains logic we want to do for all routes pertaining to a given dashID, such as setting up the access store
const DashboardIdRoute = ({ children }) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const { dashId } = useParams();

  const setAccess = useDashboardAccessStore(state => state.setAccess);

  useQuery(
    ['ui-dashboard', 'dashboardRoute', 'my-access', dashId],
    () => ky(`servint/dashboard/${dashId}/my-access`).json()
      .then(res => {
        setAccess(dashId, res.access, stripes.hasPerm('servint.dashboards.admin'));
      })
  );

  // Leave all rendering to child routes
  return children;
};

export default DashboardIdRoute;
