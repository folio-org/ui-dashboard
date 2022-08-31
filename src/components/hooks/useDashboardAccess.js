import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import useDashboardAccessStore from './useDashboardAccessStore';

const useDashboardAccess = (dashId, options) => {
  const ky = useOkapiKy();
  const addAccess = useDashboardAccessStore(state => state.addAccess);
  const getAccess = useDashboardAccessStore(state => state.getAccess);

  const access = getAccess(dashId);

  // Run the query in the background every time we request the access level
  useQuery(
    // We need this to rerun when the dashboard updates
    ['ui-dashboard', 'dashboardRoute', 'my-access', dashId],
    () => ky(`servint/dashboard/${dashId}/my-access`).json()
      .then(res => {
        if (access !== res.access) {
          addAccess(dashId, res.access);
        }
      }),
    options
  );

  const hasAccess = (requiredLevel) => {
    switch (requiredLevel) {
      case 'view':
        return access === 'view' || hasAccess('edit');
      case 'edit':
        return access === 'edit' || hasAccess('manage');
      case 'manage':
        return access === 'manage';
      default:
        return false;
    }
  };

  return { access, hasAccess };
};

export default useDashboardAccess;
