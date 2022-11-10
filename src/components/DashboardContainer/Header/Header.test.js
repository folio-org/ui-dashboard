

import { StaticRouter as Router } from 'react-router-dom';

import {
  HeadlineInteractor as Headline,
  renderWithIntl
} from '@folio/stripes-erm-testing';
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
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    // Each access test block has two tests so repeat implementation
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
  describe('Header with one dashboard', () => {
    beforeEach(() => {
      renderWithIntl(
        <Router>
          <Header
            {
              ...{
                ...headerProps,
                dashboards: [dashboardsAccess[0]]
              }
            }
          />
        </Router>,
        translationsProperties
      );
    });

    test('renders the name of the dashboard in the header', async () => {
      await Headline('My dashboard').exists();
    });
  });

  describe('Header with one dashboard', () => {
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

    test('renders a ButtonGroup containing all pertinent dashboards', async () => {
      await Button('My dashboard').exists();
      await Button('Test dash 1').exists();
      await Button('Test dash 3').exists();
    });
  });

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
      await Button('Manage widgets').exists();
      await Button('Manage user access').exists();
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
      await Button('Manage widgets').exists();
      await Button('View user access').exists();
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
      await Button('Manage widgets').absent();
      await Button('View user access').exists();
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
      await Button('Manage widgets').exists();
      await Button('Manage user access').exists();
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


