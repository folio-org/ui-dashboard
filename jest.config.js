const jestConfig = require('@folio/stripes-erm-components/jest.config');

module.exports = {
  ...jestConfig,
  testEnvironment: 'jsdom'
};
