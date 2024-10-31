import React from 'react';

import { Dropdown, renderWithIntl } from '@folio/stripes-erm-testing';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import WidgetHeader from './WidgetHeader';
import translationsProperties from '../../../test/helpers';

const widgetName = 'Widget Test 1';
const widgetId = '123456789';

const onWidgetEdit = jest.fn(() => null);
const onWidgetDelete = jest.fn(() => null);
const widgetMoveHandler = jest.fn(() => null);

jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useDashboardAccess: jest.fn()
    .mockReturnValue({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => true, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: false })
    .mockReturnValueOnce({ hasAccess: () => false, hasAdminPerm: true })
}));


describe('WidgetHeader', () => {
  let renderComponent;
  let actionsButton;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <WidgetHeader
        name={widgetName}
        onWidgetDelete={onWidgetDelete}
        onWidgetEdit={onWidgetEdit}
        widgetId={widgetId}
        widgetMoveHandler={widgetMoveHandler}
      />,
      translationsProperties
    );

    actionsButton = Dropdown(/Actions for widget: Widget Test 1/i);
  });

  test('renders expected widget name', () => {
    const { getByText } = renderComponent;
    expect(getByText(widgetName)).toBeInTheDocument();
  });

  test('renders actions button with correct menu options available on click with \'edit\' access', async () => {
    const { getByRole } = renderComponent;
    expect(actionsButton.exists());

    expect(getByRole('button', { name: /Edit widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
    expect(getByRole('button', { name: /Delete widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
  });

  test('renders actions button with correct menu options available on click without \'edit\' access', async () => {
    const { getByRole } = renderComponent;
    expect(actionsButton.exists());

    expect(getByRole('button', { name: /Edit widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
    expect(getByRole('button', { name: /Delete widget: Widget Test 1/i, hidden: true })).toBeInTheDocument();
  });

  test('renders actions button with correct menu options available on click without \'edit\' access but with admin perm', async () => {
    expect(actionsButton.absent());
  });

  describe('clicking edit button', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await actionsButton.choose('Edit');
      });
    });

    test('fires onWidgetEdit on clicking edit button', async () => {
      await waitFor(() => {
        expect(onWidgetEdit.mock.calls.length).toBe(1);
      });
    });
  });

  describe('clicking delete button', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await actionsButton.choose('Delete');
      });
    });

    test('fires onWidgetEdit on clicking edit button', async () => {
      await waitFor(() => {
        expect(onWidgetDelete.mock.calls.length).toBe(1);
      });
    });
  });
});
