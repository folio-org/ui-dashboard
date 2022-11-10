import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';


import translationsProperties from '../../../../test/helpers';

import NoWidgets from './NoWidgets';


describe('NoWidgets', () => {
  test('renders expected noWidget text', () => {
    const { getByText } = renderWithIntl(
      <NoWidgets />,
      translationsProperties
    );

    expect(getByText('Add a new widget to your dashboard')).toBeInTheDocument();
  });
});
