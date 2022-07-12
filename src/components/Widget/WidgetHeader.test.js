import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { Dropdown } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import WidgetHeader from './WidgetHeader';
import translationsProperties from '../../../test/helpers';

const widgetName = 'Widget Test 1';
const widgetId = '123456789';

const onWidgetEdit = jest.fn(() => null);
const onWidgetDelete = jest.fn(() => null);


describe('WidgetHeader', () => {
  test('renders expected widget name', () => {
    const { getByText } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    expect(getByText(widgetName)).toBeInTheDocument();
  });

  test('renders actions button with correct menu options available on click', async () => {
    const { getByRole } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    const actionsButton = Dropdown(/Actions for widget: Widget Test 1/i);

    expect(actionsButton.exists());

    expect(getByRole('button', { name: /Edit widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
    expect(getByRole('button', { name: /Delete widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
  });

  test('fires onWidgetEdit on clicking edit button', async () => {
    renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    const actionsButton = Dropdown(/Actions for widget: Widget Test 1/i);
    await actionsButton.choose('Edit');

    expect(onWidgetEdit.mock.calls.length).toBe(1);
  });

  test('fires onWidgetDelete on clicking delete button', async () => {
    renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    const actionsButton = Dropdown(/Actions for widget: Widget Test 1/i);
    await actionsButton.choose('Delete');

    expect(onWidgetDelete.mock.calls.length).toBe(1);
  });
});
