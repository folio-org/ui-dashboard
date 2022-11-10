import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import { Button } from '@folio/stripes-testing';
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
    await Button('Actions').click();
  });
});


