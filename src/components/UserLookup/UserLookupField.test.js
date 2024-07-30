import { useRef as mockUseRef } from 'react';

import { Pluggable } from '@folio/stripes/core';

import { Field } from 'react-final-form';

import {
  TestForm,
  TextField,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';

import UserLookupField from './UserLookupField';

const onSubmit = jest.fn();
const mockOnClick = jest.fn();

/*
  EXAMPLE Overriding stripes-core component Pluggable
  NOTE Pluggable had to be configured with a jest.fn so we could do this

  Issues are caused here by the structure, stripes/core vs stripes-core,
  so we're effectively limited to whatever erm-testing sets up
*/

const MockPluggable = ({ children, renderTrigger }) => {
  const buttonRef = mockUseRef();
  return (
    <>
      {renderTrigger({
        buttonRef,
        onClick: mockOnClick,
        id: 'test-id'
      })}
      {children}
    </>
  );
};
Pluggable.mockImplementation(MockPluggable);

let renderedComponent;
describe('UserLookupField', () => {
  describe('Rendering field in empty form', () => {
    beforeEach(() => {
      renderedComponent = renderWithIntl(
        <TestForm
          initialValues={{}}
          mutators={{
            sortByName: jest.fn()
          }}
          onSubmit={onSubmit}
        >
          <Field
            component={UserLookupField}
            name="testComponent"
          />
        </TestForm>,
        translationsProperties
      );
    });

    test('renders fallback as expected', async () => {
      await TextField().exists();
    });

    test('renders empty user card as expected', () => {
      const { getByText } = renderedComponent;
      expect(getByText('No user linked')).toBeInTheDocument();
    });
  });
});
