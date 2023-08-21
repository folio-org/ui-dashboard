import React from 'react';

import { renderWithIntl } from '@folio/stripes-erm-testing';

import Widget from './Widget';
import translationsProperties from '../../../test/helpers/translationsProperties';

const widget = {
  name: 'Widget Test 1',
  id: '12345',
  definition: {
    name: 'test def',
    version: '1'
  }
};

const onError = jest.fn(() => null);
const onWidgetEdit = jest.fn(() => null);
const onWidgetDelete = jest.fn(() => null);
const widgetMoveHandler = jest.fn(() => null);


// EXAMPLE -- useWidgetDefinition has a mock for all tests in hooks/__mocks__
jest.mock('../../hooks');

let renderComponent;
describe('Widget', () => {
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <Widget
        onError={onError}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widget={widget}
        widgetMoveHandler={widgetMoveHandler}
      />,
      translationsProperties
    );
  });

  test('renders expected widget name', () => {
    const { getByText } = renderComponent;
    expect(getByText(widget.name)).toBeInTheDocument();
  });

  test('renders expected widget footer', () => {
    const { getByText } = renderComponent;
    expect(getByText('Test footer')).toBeInTheDocument();
  });

  test('renders expected widget component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Test body')).toBeInTheDocument();
  });
});
