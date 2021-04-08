import React from 'react';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import translationsProperties from '../../../../test/helpers';

import WidgetFooter from './WidgetFooter';

const widgetFooterProps = {
  onRefresh: jest.fn(() => null),
  timestamp: moment(Date.now()).format('hh:mm a'),
  rightContent: <div> Right content </div>,
  widgetName: 'Test widget 1',
  widgetId: '123456789'
};

describe('WidgetFooter', () => {
  test('renders refresh button with correct aria-label', () => {
    const { getByRole } = renderWithIntl(
      <WidgetFooter
        {...widgetFooterProps}
      />,
      translationsProperties
    );
    expect(getByRole('button', { name: `Refresh widget: ${widgetFooterProps.widgetName}` })).toBeInTheDocument();
  });

  test('clicking refresh button calls onRefresh', () => {
    const { getByRole } = renderWithIntl(
      <WidgetFooter
        {...widgetFooterProps}
      />,
      translationsProperties
    );
    const refreshButton = getByRole('button', { name: `Refresh widget: ${widgetFooterProps.widgetName}` });
    userEvent.click(refreshButton);
    expect(widgetFooterProps.onRefresh.mock.calls.length).toBe(1);
  });

  test('renders timestamp correctly', () => {
    const { getByText } = renderWithIntl(
      <WidgetFooter
        {...widgetFooterProps}
      />,
      translationsProperties
    );
    expect(getByText(widgetFooterProps.timestamp)).toBeInTheDocument();
  });

  test('renders right content correctly', () => {
    const { getByText } = renderWithIntl(
      <WidgetFooter
        {...widgetFooterProps}
      />,
      translationsProperties
    );
    expect(getByText(/right content/i)).toBeInTheDocument();
  });
});
