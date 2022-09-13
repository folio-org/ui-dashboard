import '@folio/stripes-erm-components/test/jest/__mock__';

import { StaticRouter as Router } from 'react-router-dom';

import {
  HeadlineInteractor as Headline,
  renderWithIntl
} from '@folio/stripes-erm-components';
import { Button } from '@folio/stripes-testing';

import translationsProperties from '../../../../test/helpers';
import Header from './Header';

import dashboardsAccess from '../../../../test/jest/dashboardsAccess';

const onCreateDashboard = jest.fn();
const onCreateWidget = jest.fn();
const onDeleteDashboard = jest.fn();
const onEdit = jest.fn();
const onManageDashboards = jest.fn();
const onReorder = jest.fn();
const onUserAccess = jest.fn();

const dashboard = dashboardsAccess[0]?.dashboard;


const headerProps = {
  dashboard,
  dashboards: dashboardsAccess,
  onCreateDashboard,
  onCreateWidget,
  onDeleteDashboard,
  onEdit,
  onManageDashboards,
  onReorder,
  onUserAccess
};


jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDashboardAccess: jest.fn()
    // Each block has two tests so repeat implementation
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: (acc) => acc === 'edit', hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: (acc) => acc === 'edit', hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: true })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: true })
}));

describe('Header', () => {
  describe('Header with \'manage\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <Header
            {...headerProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('My dashboard').exists();
      await Button('New widget').exists();
      await Button('Edit dashboard').exists();
      await Button('Order widgets').exists();
      await Button('User access').exists();
      await Button('Delete dashboard').exists();
    });

    test('renders the expected all dashboards action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('All dashboards').exists();
      await Button('New dashboard').exists();
      await Button('Manage dashboards').exists();
    });
  });

  describe('Header with \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <Header
            {...headerProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('My dashboard').exists();
      await Headline('All dashboards').exists();
      await Button('New widget').exists();
      await Button('Edit dashboard').exists();
      await Button('Order widgets').exists();
      await Button('User access').exists();
      await Button('Delete dashboard').absent();
    });

    test('renders the expected all dashboards action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('All dashboards').exists();
      await Button('New dashboard').exists();
      await Button('Manage dashboards').exists();
    });
  });

  describe('Header without \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <Header
            {...headerProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('My dashboard').exists();
      await Headline('All dashboards').exists();
      await Button('New widget').absent();
      await Button('Edit dashboard').absent();
      await Button('Order widgets').absent();
      await Button('User access').exists();
      await Button('Delete dashboard').absent();
    });

    test('renders the expected all dashboards action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('All dashboards').exists();
      await Button('New dashboard').exists();
      await Button('Manage dashboards').exists();
    });
  });

  describe('Header without \'edit\' access but with admin perm', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <Header
            {...headerProps}
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('My dashboard').exists();
      await Headline('All dashboards').exists();
      await Button('New widget').exists();
      await Button('Edit dashboard').exists();
      await Button('Order widgets').exists();
      await Button('User access').exists();
      await Button('Delete dashboard').exists();
    });

    test('renders the expected all dashboards action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('All dashboards').exists();
      await Button('New dashboard').exists();
      await Button('Manage dashboards').exists();
    });
  });
});


