import React from 'react';
import PropTypes from 'prop-types';

import { Field, useForm } from 'react-final-form';
import {
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

const SimpleSearchResultField = ({ resultColumns, input: { name } }) => {
  const { change } = useForm();

  // Set up result columns to populate result col select
  const selectifiedResultColumns = resultColumns.map(rc => ({ value: rc.name, label: rc.label || rc.name }));

  return (
    <Row>
      <Col xs={6}>
        <Field
          component={Select}
          dataOptions={selectifiedResultColumns}
          defaultValue={selectifiedResultColumns[0].value}
          name={`${name}.name`}
          onChange={
            e => {
              change(`${name}.name`, e.target.value);

              // Keep track of which result column has been selected
              const selectedResultColumn = selectifiedResultColumns.find(rc => rc.value === e.target.value);
              change(`${name}.label`, selectedResultColumn?.label || selectedResultColumn?.name);
            }
          }
        />
      </Col>
      <Col xs={6}>
        <Field
          component={TextField}
          defaultValue={selectifiedResultColumns[0].label}
          name={`${name}.label`}
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
