// Special mocking for
module.exports = {
  ...jest.requireActual('../'),
  useWidgetDefinition: jest.fn(() => ({
    specificWidgetDefinition: {
      definition: {},
      typeName: 'Test type'
    },
    componentBundle: {
      WidgetComponent: () => <div> Test body </div>,
      FooterComponent: () => <div> Test footer </div>
    }
  })),
  // Ensure mocked useDashboardAccess always returns true for access
  useDashboardAccess: jest.fn(() => ({ hasAccess: () => true, hasAdminPerm: false }))
};
