import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Button, renderWithIntl } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';
import ActionMenu from './ActionMenu';

const actionMenu = () => {};

describe('UrlCustomizer', () => {
  beforeEach(() => {
    renderWithIntl(
      <ActionMenu
        actionMenu={actionMenu}
      />,
      translationsProperties
    );
  });

  test('renders the expected action button', async () => {
    await Button('Actions').exists();
    await waitFor(async () => {
      await Button('Actions').click();
    });
  });
});


