import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';


import translationsProperties from '../../../test/helpers';

import Loading from './Loading';


describe('NoWidgets', () => {
  test('renders expected loading text', () => {
    const { getByText } = renderWithIntl(
      <Loading />,
      translationsProperties
    );

    expect(getByText('Loading')).toBeInTheDocument();
  });
});
