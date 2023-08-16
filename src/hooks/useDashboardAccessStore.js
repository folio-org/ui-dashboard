import { createWithEqualityFn } from 'zustand/traditional';

const useDashboardAccessStore = createWithEqualityFn((set, get) => ({
  dashboards: {},
  setAccess: (dashId, access, hasAdminPerm) => set(state => {
    return {
      ...state,
      dashboards: {
        ...get().dashboards,
        [dashId]: {
          access,
          hasAccess: (accessLevel) => {
            switch (accessLevel) {
              case 'view':
                return access === 'view' || get().dashboards?.[dashId]?.hasAccess('edit');
              case 'edit':
                return access === 'edit' || get().dashboards?.[dashId]?.hasAccess('manage');
              case 'manage':
                return access === 'manage';
              default:
                return false;
            }
          },
          hasAdminPerm
        }
      }
    };
  }),
}));

export default useDashboardAccessStore;
