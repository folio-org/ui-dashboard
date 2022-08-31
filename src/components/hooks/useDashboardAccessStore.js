import create from 'zustand';

const useDashboardAccess = create((set, get) => ({
  dashboards: {},
  addAccess: (dashId, access) => set((state) => {
    return { dashboards: { [dashId]: access, ...state } };
  }),
  removeAccess: (dashId) => set((state) => {
    const { [dashId]: _valueToRemove, ...newKeys } = state.intlKeys;
    return { dashboards: newKeys };
  }),
  getAccess: (dashId) => {
    return get().dashboards?.[dashId];
  }
}));

export default useDashboardAccess;
