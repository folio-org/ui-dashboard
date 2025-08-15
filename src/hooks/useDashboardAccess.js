import { useShallow } from 'zustand/shallow';
import useDashboardAccessStore from './useDashboardAccessStore';

// Export these in one go, to make imports slighly nicer
const useDashboardAccess = (dashId) => {
  return useDashboardAccessStore(
    useShallow(state => ({
      access: state.dashboards[dashId]?.access,
      hasAccess: state.dashboards[dashId]?.hasAccess ?? (() => null),
      hasAdminPerm: state.dashboards[dashId]?.hasAdminPerm,
    }))
  );
};

export default useDashboardAccess;
