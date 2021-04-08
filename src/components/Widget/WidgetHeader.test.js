import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import userEvent from '@testing-library/user-event';

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

  test('renders actions button with correct menu options available on click', () => {
    const { getByRole } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    const actionsButton = getByRole('button', { name: /Actions for widget: Widget Test 1/i });
    expect(actionsButton).toBeInTheDocument();

    userEvent.click(actionsButton);
    expect(getByRole('button', { name: /Edit widget: Widget Test 1/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /Remove widget: Widget Test 1/i })).toBeInTheDocument();
  });


  test('fires onWidgetEdit on clicking edit button', () => {
    const { getByRole } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    userEvent.click(getByRole('button', { name: /Actions for widget: Widget Test 1/i }));
    userEvent.click(getByRole('button', { name: /Edit widget: Widget Test 1/i }));
    expect(onWidgetEdit.mock.calls.length).toBe(1);
  });

  test('fires onWidgetDelete on clicking delete button', () => {
    const { getByRole } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
      />,
      translationsProperties
    );

    userEvent.click(getByRole('button', { name: /Actions for widget: Widget Test 1/i }));
    userEvent.click(getByRole('button', { name: /Remove widget: Widget Test 1/i }));
    expect(onWidgetDelete.mock.calls.length).toBe(1);
  });
});
