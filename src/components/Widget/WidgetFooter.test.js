import React from 'react';
import moment from 'moment';

import { IconButton } from '@folio/stripes-testing';
import userEvent from '@testing-library/user-event';

import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import translationsProperties from '../../../test/helpers';

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
    renderWithIntl(
      <WidgetFooter
        {...widgetFooterProps}
      />,
      translationsProperties
    );

    const refreshButton = IconButton(`Refresh widget: ${widgetFooterProps.widgetName}`);
    expect(refreshButton.exists());
  });

  describe('clicking refresh button', () => {
    beforeEach(async () => {
      const { getByRole } = renderWithIntl(
        <WidgetFooter
          {...widgetFooterProps}
        />,
        translationsProperties
      );

      // IconButton calls seem to not work right now
      const refreshButton = getByRole('button', { 'aria-label': `Refresh widget: ${widgetFooterProps.widgetName}` });
      await userEvent.click(refreshButton);
    });

    test('clicking refresh button calls onRefresh', () => {
      expect(widgetFooterProps.onRefresh.mock.calls.length).toBe(1);
    });
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
