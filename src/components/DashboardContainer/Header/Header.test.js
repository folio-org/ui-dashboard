import '@folio/stripes-erm-components/test/jest/__mock__';
import {
  HeadlineInteractor as Headline,
  renderWithIntl
} from '@folio/stripes-erm-components';
import { Button } from '@folio/stripes-testing';

import translationsProperties from '../../../../test/helpers';
import Header from './Header';

const onCreateWidget = jest.fn();
const onReorder = jest.fn();
const onUserAccess = jest.fn();

const dashboard = {
  id: '1234',
  name: 'testDashboard'
};

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDashboardAccess: jest.fn()
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: true })
}));

describe('Header', () => {
  describe('Header with \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <Header
          dashboard={dashboard}
          onCreateWidget={onCreateWidget}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('testDashboard').exists();
      await Button('New widget').exists();
      await Button('Order widgets').exists();
      await Button('User access').exists();
    });
  });

  describe('Header without \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <Header
          dashboard={dashboard}
          onCreateWidget={onCreateWidget}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('testDashboard').exists();
      await Button('New widget').absent();
      await Button('Order widgets').absent();
      await Button('User access').exists();
    });
  });

  describe('Header without \'edit\' access but with admin perm', () => {
    beforeEach(() => {
      renderWithIntl(
        <Header
          dashboard={dashboard}
          onCreateWidget={onCreateWidget}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected dashboard action button dropdown', async () => {
      await Button('Actions').click();
      await Headline('testDashboard').exists();
      await Button('New widget').exists();
      await Button('Order widgets').exists();
      await Button('User access').exists();
    });
  });
});


