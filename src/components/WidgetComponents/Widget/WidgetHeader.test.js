import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import WidgetHeader from './WidgetHeader';

const widgetName = 'Widget Test 1';
const widgetId = '123456789';

describe('WidgetHeader', () => {
  test('renders expected widget name', () => {
    const { getByText } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        widgetId={widgetId}
      />
    );

    expect(getByText(widgetName)).toBeInTheDocument();
  });
});
