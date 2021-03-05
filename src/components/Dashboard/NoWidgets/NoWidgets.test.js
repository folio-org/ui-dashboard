import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';

import translationsProperties from '../../../../test/helpers';

import NoWidgets from './NoWidgets';


describe('NoWidgets', () => {
  test('renders expected noWidget text', () => {
    const { getByText } = renderWithIntl(
      <NoWidgets/>,
      translationsProperties
    );

    expect(getByText("Add a new widget to your dashboard")).toBeInTheDocument();
  });
});
