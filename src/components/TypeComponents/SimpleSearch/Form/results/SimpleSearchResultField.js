import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Field, useForm } from 'react-final-form';
import {
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import css from './SimpleSearchResults.css';

const SimpleSearchResultField = ({ resultColumns, input }) => {
  const { change } = useForm();

  // Set up result columns to populate result col select
  const selectifiedResultColumns = resultColumns.map(rc => ({ value: rc.name, label: rc.label || rc.name }));

  return (
    <Row
      className={css.innerRow}
    >
      <Col xs={6}>
        <Field
          component={Select}
          dataOptions={selectifiedResultColumns}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.results.column" />}
          name={`${input.name}.name`}
          onChange={e => {
            const selectedResultColumn = selectifiedResultColumns.find(rc => rc.value === e.target.value);
            change(`${input.name}.name`, e.target.value);
            change(`${input.name}.label`, selectedResultColumn?.label || selectedResultColumn?.name);
          }}
        />
      </Col>
      <Col xs={6}>
        <Field
          component={TextField}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.results.label" />}
          name={`${input.name}.label`}
        />
      </Col>
    </Row>
  );
};

SimpleSearchResultField.propTypes = {
  resultColumns: PropTypes.arrayOf(PropTypes.object),
  input: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default SimpleSearchResultField;
