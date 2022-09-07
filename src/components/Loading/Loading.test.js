import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';

import translationsProperties from '../../../../test/helpers';

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
