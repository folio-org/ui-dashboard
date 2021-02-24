import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Button, Headline, KeyValue } from '@folio/stripes/components';

import RowWithDelete from '../../../WidgetComponents/misc/RowWithDelete';
import SimpleSearchResultField from './SimpleSearchResultField';

const SimpleSearchResultArray = ({
  addButtonId,
  addLabelId,
  data: {
    resultColumns = []
  } = {},
  fields,
  headerId,
  id
}) => {
  const renderResultFields = () => {
    return (
      fields.map((fieldName, index) => (
        <RowWithDelete
          key={`simple-search-result-array-${fieldName}`}
          onDelete={() => fields.remove(index)}
        >
          <Field
            component={SimpleSearchResultField}
            name={fieldName}
            resultColumns={resultColumns}
          />
        </RowWithDelete>
      ))
    );
  };

  return (
    <div>
      <KeyValue
        data-testid="simpleSearchResultArray"
        id={id}
        label={
          <Headline margin="x-small" size="medium" tag="h2">
            <FormattedMessage id={headerId} />
          </Headline>
        }
      >
        {renderResultFields()}
      </KeyValue>
      <Button id={addButtonId} onClick={() => fields.push({})}>
        <FormattedMessage id={addLabelId} />
      </Button>
    </div>
  );
};

SimpleSearchResultArray.propTypes = {
  addButtonId: PropTypes.string,
  addLabelId: PropTypes.string,
  data: PropTypes.shape({
    resultColumns: PropTypes.arrayOf(PropTypes.object)
  }),
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }),
  headerId: PropTypes.string,
  id: PropTypes.string
};

export default SimpleSearchResultArray;
