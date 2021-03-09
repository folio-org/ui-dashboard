import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import RowWithDelete from './RowWithDelete';

const onDelete = jest.fn(() => null);

const renderChildrenText = 'Children of RowWithDelete';

describe('RowWithDelete', () => {
  test('renders children with delete', () => {
    const { getByText } = renderWithIntl(
      <RowWithDelete
        onDelete={onDelete}
      >
        <p> {renderChildrenText} </p>
      </RowWithDelete>
    );

    expect(getByText(renderChildrenText)).toBeInTheDocument();
  });

  test('renders trash button', () => {
    const { getByRole } = renderWithIntl(
      <RowWithDelete
        onDelete={onDelete}
      >
        <p> {renderChildrenText} </p>
      </RowWithDelete>
    );

    expect(getByRole('button', { name: 'trash' })).toBeInTheDocument();
  });

  test('clicking trash button fires onDelete', () => {
    const { getByRole } = renderWithIntl(
      <RowWithDelete
        onDelete={onDelete}
      >
        <p> {renderChildrenText} </p>
      </RowWithDelete>
    );

    const trashButton = getByRole('button', { name: 'trash' });
    userEvent.click(trashButton);
    expect(onDelete.mock.calls.length).toBe(1);
  });
});
