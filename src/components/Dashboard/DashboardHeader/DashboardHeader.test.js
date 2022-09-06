import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import DashboardHeader from './DashboardHeader';

const onCreate = jest.fn();
const onReorder = jest.fn();
const onUserAccess = jest.fn();

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDashboardAccess: jest.fn()
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: true })
}));

describe('DashboardHeader', () => {
  describe('DashboardHeader with \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <DashboardHeader
          dashId="1234"
          onCreate={onCreate}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected action button dropdown', async () => {
      await Button('Actions').click();
      await Button('New').exists();
      await Button('Edit widget display order').exists();
      await Button('User access').exists();
    });
  });

  describe('DashboardHeader without \'edit\' access', () => {
    beforeEach(() => {
      renderWithIntl(
        <DashboardHeader
          dashId="1234"
          onCreate={onCreate}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected action button dropdown', async () => {
      await Button('Actions').click();
      await Button('User access').exists();
    });
  });

  describe('DashboardHeader without \'edit\' access but with admin perm', () => {
    beforeEach(() => {
      renderWithIntl(
        <DashboardHeader
          dashId="1234"
          onCreate={onCreate}
          onReorder={onReorder}
          onUserAccess={onUserAccess}
        />,
        translationsProperties
      );
    });

    test('renders the expected action button dropdown', async () => {
      await Button('Actions').click();
      await Button('New').exists();
      await Button('Edit widget display order').exists();
      await Button('User access').exists();
    });
  });
});


