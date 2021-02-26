import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import Widget from './Widget';

const widget = {
  name: 'Widget Test 1',
  id: '12345'
};

describe('Widget', () => {
  test('renders expected widget name', () => {
    const { getByText } = renderWithIntl(
      <Widget
        widget={widget}
      >
        <div> Test body </div>
      </Widget>
    );

    expect(getByText(widget.name)).toBeInTheDocument();
  });

  test('renders expected widget content', () => {
    const { getByText } = renderWithIntl(
      <Widget
        widget={widget}
      >
        <div> Test body </div>
      </Widget>
    );

    expect(getByText('Test body')).toBeInTheDocument();
  });
});
