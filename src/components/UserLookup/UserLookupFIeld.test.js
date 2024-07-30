import { Field } from 'react-final-form';

import {
  TestForm,
  TextField,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../../test/helpers';

import UserLookupField from './UserLookupField';

const onSubmit = jest.fn();


describe('UserLookupField', () => {
  describe('Rendering field in empty form', () => {
    beforeEach(() => {
      renderWithIntl(
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

    test('rendersfallback as expected', async () => {
      await TextField().exists();
    });
  });
});
