import React from 'react';
import { get } from 'lodash';
import { Field, useForm, useFormState } from 'react-final-form';
import {
  Col,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

const SimpleSearchResultField = ({ resultColumns, input: { name } }) => {
  const { change } = useForm();

  // Set up result columns to populate result col select
  const selectifiedResultColumns = resultColumns.map(rc => ({value: rc.name, label: rc.label || rc.name}))

  return (
    <Row>
      <Col xs={6}>
        <Field 
          name={`${name}.name`}
          component={Select}
          dataOptions={selectifiedResultColumns}
          defaultValue={selectifiedResultColumns[0].value}
          onChange={
            e => {
              change(`${name}.name`, e.target.value);

              // Keep track of which result column has been selected
              const selectedResultColumn = selectifiedResultColumns.find(rc => rc.value === e.target.value)
              change(`${name}.label`, selectedResultColumn?.label || selectedResultColumn?.name);
            }
          }
        />
      </Col>
      <Col xs={6}>
        <Field
          name={`${name}.label`}
          component={TextField}
          defaultValue={selectifiedResultColumns[0].label}
        />
      </Col>
    </Row>
  );
}

export default SimpleSearchResultField;