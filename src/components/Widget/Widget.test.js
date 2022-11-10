import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import Widget from './Widget';

const widget = {
  name: 'Widget Test 1',
  id: '12345'
};

const onWidgetEdit = jest.fn(() => null);
const onWidgetDelete = jest.fn(() => null);

describe('Widget', () => {
  test('renders expected widget name', () => {
    const { getByText } = renderWithIntl(
      <Widget
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
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
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widget={widget}
      >
        <div> Test body </div>
      </Widget>
    );

    expect(getByText('Test body')).toBeInTheDocument();
  });
});
