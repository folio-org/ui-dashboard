import { FieldArray } from 'react-final-form-arrays';

import { MemoryRouter } from 'react-router-dom';

import {
  MessageBanner,
  MultiColumnList,
  MultiColumnListHeader,
  renderWithIntl,
  TestForm
} from '@folio/stripes-erm-testing';

import UserAccessFieldArray from './UserAccessFieldArray';

import translationsProperties from '../../../test/helpers';
import { useDashboardAccess } from '../hooks';

const onSubmit = jest.fn();
const onClose = jest.fn();

jest.mock('../hooks');

// Not loving this, needs refactoring to newer pattern at some point
const access = [
  {
    access: 'view',
    id: '51a6919a-c267-4b5b-bd23-defbe7b3789f',
    user: {
      username: 'morty',
      id: 'bec20636-fb68-41fd-84ea-2cf910673599',
      barcode: '456',
      active: false,
      patronGroup: '3684a786-6671-4268-8ed0-9db82ebca60b',
      departments: [],
      proxyFor: [],
      personal: {
        lastName: 'morty',
        firstName: 'panic',
        email: 'morty@example.com',
        addresses: [],
        preferredContactTypeId: '002'
      },
      enrollmentDate: '2020-10-07T04:00:00.000+00:00',
      createdDate: '2022-09-06T01:53:03.251+00:00',
      updatedDate: '2022-09-06T01:53:03.251+00:00',
      metadata: {
        createdDate: '2022-09-06T01:53:03.246+00:00',
        updatedDate: '2022-09-06T01:53:03.246+00:00'
      }
    }
  },
  {
    access: 'edit',
    id: '216c6163-5a3e-48c8-bf75-91d43211ad22',
    user: {
      username: 'innreachClient',
      id: '4b7fbf8e-4e5c-5eb2-97f2-2cf8db7d1e4b',
      active: true,
      departments: [],
      proxyFor: [],
      personal: {
        lastName: 'SYSTEM',
        firstName: 'innreachClient',
        addresses: []
      },
      createdDate: '2022-09-06T02:03:02.809+00:00',
      updatedDate: '2022-09-06T02:03:02.809+00:00',
      metadata: {
        createdDate: '2022-09-06T02:03:02.806+00:00',
        createdByUserId: '39d156da-8eb5-5d44-bdd5-3c3dac3a0f9a',
        updatedDate: '2022-09-06T02:03:02.806+00:00',
        updatedByUserId: '39d156da-8eb5-5d44-bdd5-3c3dac3a0f9a'
      }
    }
  },
  {
    access: 'manage',
    id: '5e81ffea-33ed-4775-aa47-54c8ced20749',
    user: {
      username: 'diku_admin',
      id: '39d156da-8eb5-5d44-bdd5-3c3dac3a0f9a',
      active: true,
      patronGroup: '3684a786-6671-4268-8ed0-9db82ebca60b',
      departments: [],
      proxyFor: [],
      personal: {
        lastName: 'ADMINISTRATOR',
        firstName: 'DIKU',
        email: 'admin@diku.example.org',
        addresses: []
      },
      createdDate: '2022-09-06T01:59:00.481+00:00',
      updatedDate: '2022-09-06T01:59:00.481+00:00',
      metadata: {
        createdDate: '2022-09-06T01:55:39.333+00:00',
        updatedDate: '2022-09-06T01:59:00.478+00:00',
        updatedByUserId: '39d156da-8eb5-5d44-bdd5-3c3dac3a0f9a'
      }
    }
  },
  {
    access: 'view',
    id: '24c94d04-7590-4134-a7eb-dda2228f3e32',
    user: 'deleted-user-id'
  }
];

describe('UserAccessFieldArray', () => {
  describe('UserAccessFieldArray with \'manage\' access', () => {
    beforeEach(() => {
      useDashboardAccess.mockImplementation(() => ({ hasAccess: () => true, hasAdminPerm: false }));
      renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{
              access
            }}
            mutators={{
              sortByName: jest.fn()
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={UserAccessFieldArray}
              dashboard={{ id: '1234', name: 'test-dashboard' }}
              name="access"
              onClose={onClose}
              onSubmit={onSubmit}
            />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });

    test('Renders an error about removed user', async () => {
      await MessageBanner('<strong>Error</strong>: user <strong>{user}</strong> cannot be found in the Users app. This could mean that the user has been permanently deleted. If the problem persists the user should be removed from this dashboard.').exists();
    });

    test('Renders a warning about inactive user', async () => {
      await MessageBanner('<strong>Warning</strong>: user <strong>{user}</strong> is inactive and should be removed from this dashboard.').exists();
    });

    test('Renders an MCL with the expected headers', async () => {
      await MultiColumnList().exists();
      await MultiColumnListHeader({ index: 0 }).has({ content: 'User' });
      await MultiColumnListHeader({ index: 1 }).has({ content: 'Status' });
      await MultiColumnListHeader({ index: 2 }).has({ content: 'Email' });
      await MultiColumnListHeader({ index: 3 }).has({ content: 'Access level' });
      await MultiColumnListHeader({ index: 4 }).has({ content: 'Remove' });
    });
  });

  describe('UserAccessFieldArray without \'manage\' access', () => {
    beforeEach(() => {
      useDashboardAccess.mockImplementation(() => ({ hasAccess: () => false, hasAdminPerm: false }));
      renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{
              access
            }}
            mutators={{
              sortByName: jest.fn()
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={UserAccessFieldArray}
              dashboard={{ id: '1234', name: 'test-dashboard' }}
              name="access"
              onClose={onClose}
              onSubmit={onSubmit}
            />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });

    test('Renders an error about removed user', async () => {
      await MessageBanner('<strong>Error</strong>: user <strong>{user}</strong> cannot be found in the Users app. This could mean that the user has been permanently deleted. If the problem persists the user should be removed from this dashboard.').exists();
    });

    test('Renders a warning about inactive user', async () => {
      await MessageBanner('<strong>Warning</strong>: user <strong>{user}</strong> is inactive and should be removed from this dashboard.').exists();
    });

    test('Renders an MCL with the expected headers', async () => {
      await MultiColumnList().exists();
      await MultiColumnListHeader({ index: 0 }).has({ content: 'User' });
      await MultiColumnListHeader({ index: 1 }).has({ content: 'Status' });
      await MultiColumnListHeader({ index: 2 }).has({ content: 'Email' });
      await MultiColumnListHeader({ index: 3 }).has({ content: 'Access level' });
      await MultiColumnListHeader({ index: 4 }).absent();
    });
  });

  describe('UserAccessFieldArray without \'manage\' access', () => {
    beforeEach(() => {
      useDashboardAccess.mockImplementation(() => ({ hasAccess: () => false, hasAdminPerm: true }));
      renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{
              access
            }}
            mutators={{
              sortByName: jest.fn()
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={UserAccessFieldArray}
              dashboard={{ id: '1234', name: 'test-dashboard' }}
              name="access"
              onClose={onClose}
              onSubmit={onSubmit}
            />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });

    test('Renders an error about removed user', async () => {
      await MessageBanner('<strong>Error</strong>: user <strong>{user}</strong> cannot be found in the Users app. This could mean that the user has been permanently deleted. If the problem persists the user should be removed from this dashboard.').exists();
    });

    test('Renders a warning about inactive user', async () => {
      await MessageBanner('<strong>Warning</strong>: user <strong>{user}</strong> is inactive and should be removed from this dashboard.').exists();
    });

    test('Renders a warning about access', async () => {
      await MessageBanner('<strong>Warning</strong>: The logged in user does not exist as a user on this dashboard. Access is being granted through a high level system permission (Okapi gateway permission "servint.dashboard.admin").').exists();
    });

    test('Renders an MCL with the expected headers', async () => {
      await MultiColumnList().exists();
      await MultiColumnListHeader({ index: 0 }).has({ content: 'User' });
      await MultiColumnListHeader({ index: 1 }).has({ content: 'Status' });
      await MultiColumnListHeader({ index: 2 }).has({ content: 'Email' });
      await MultiColumnListHeader({ index: 3 }).has({ content: 'Access level' });
      await MultiColumnListHeader({ index: 4 }).has({ content: 'Remove' });
    });
  });

  describe('UserAccessFieldArray with no removed or inactive users', () => {
    beforeEach(() => {
      useDashboardAccess.mockImplementation(() => ({ hasAccess: () => false, hasAdminPerm: false }));
      renderWithIntl(
        <MemoryRouter>
          <TestForm
            initialValues={{
              access: access.slice(1, 3)
            }}
            mutators={{
              sortByName: jest.fn()
            }}
            onSubmit={onSubmit}
          >
            <FieldArray
              component={UserAccessFieldArray}
              dashboard={{ id: '1234', name: 'test-dashboard' }}
              name="access"
              onClose={onClose}
              onSubmit={onSubmit}
            />
          </TestForm>
        </MemoryRouter>, translationsProperties
      );
    });

    test('Does not render an error about removed user', async () => {
      await MessageBanner('<strong>Error</strong>: user <strong>{user}</strong> cannot be found in the Users app. This could mean that the user has been permanently deleted. If the problem persists the user should be removed from this dashboard.').absent();
    });

    test('Does not render a warning about inactive user', async () => {
      await MessageBanner('<strong>Warning</strong>: user <strong>{user}</strong> is inactive and should be removed from this dashboard.').absent();
    });
  });
});
