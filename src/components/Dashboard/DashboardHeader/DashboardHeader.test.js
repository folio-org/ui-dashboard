import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { Button } from '@folio/stripes-testing';
import translationsProperties from '../../../../test/helpers';
import DashboardHeader from './DashboardHeader';

const data = {
  'onCreate': () => {},
  'onReorder': null
};

describe('UrlCustomizer', () => {
  beforeEach(() => {
    renderWithIntl(
      <DashboardHeader
        data={data}
      />,
      translationsProperties
    );
  });

  test('renders the expected action button dropdown', async () => {
    await Button('Actions').exists();
    await Button('Actions').click();
    await Button('New').exists();
  });
});


