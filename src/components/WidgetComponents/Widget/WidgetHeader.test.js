import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import WidgetHeader from './WidgetHeader';

const widgetName = 'Widget Test 1';

describe('WidgetHeader', () => {
  test('renders expected widget name', () => {
    const { getByText } = renderWithIntl(
      <WidgetHeader
        name={widgetName}
      />
    );

    expect(getByText(widgetName)).toBeInTheDocument();
  });
});
