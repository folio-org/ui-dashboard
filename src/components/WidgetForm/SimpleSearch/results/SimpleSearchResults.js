import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';

import { Accordion, Button, Headline } from '@folio/stripes/components';

import RowWithDelete from '../../../WidgetComponents/misc/RowWithDelete';
import SimpleSearchResultField from './SimpleSearchResultField';
import DragAndDropFieldArray from '../../../DragAndDropFieldArray';

import css from './SimpleSearchResults.css';

const SimpleSearchResults = ({
  data: {
    resultColumns = []
  } = {},
  id
}) => {
  const renderResultField = (fieldName, index, _droppable, _draggable, fields) => {
    return (
      <div className={css.resultLine}>
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
      </div>
    );
  };

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-dashboard.simpleSearchForm.results" />}
    >
      <FieldArray
        name="resultColumns"
        render={({ fields }) => (
          <>
            <Headline margin="x-small" size="medium" tag="h2">
              <FormattedMessage id="ui-dashboard.simpleSearchForm.results.columns" />
            </Headline>
            <DragAndDropFieldArray
              fields={fields}
            >
              {renderResultField}
            </DragAndDropFieldArray>
            <Button id="simple-search-form-add-result-column-button" onClick={() => fields.push({})}>
              <FormattedMessage id="ui-dashboard.simpleSearchForm.results.addResult" />
            </Button>
          </>
        )}
      />
    </Accordion>
  );
};

SimpleSearchResults.propTypes = {
  data: PropTypes.shape({
    resultColumns: PropTypes.arrayOf(PropTypes.object)
  }),
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }),
  id: PropTypes.string
};

export default SimpleSearchResults;
