import React, { useMemo } from 'react';
import { get } from 'lodash';

import { Field, useForm, useFormState } from 'react-final-form';

import {
  Col,
  Datepicker,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

const SimpleSearchFilterField = ({ filterColumns, index, input: { name } }) => {
  const { initialValues, values } = useFormState();
  const { change } = useForm();

  // Create values for available filters. If label available use that, else use name
  const selectifiedFilterNames = [{ value: '', label: '', disabled: true }, ...filterColumns.map(fc => ({ value: fc.name, label: fc.label ?? fc.name }))];
  const selectedFilter = useMemo(() => get(values, `${name}.name`), [values.filterColumns[index]]);
  const selectedFilterColumn = useMemo(() => filterColumns.find(fc => fc.name === selectedFilter), [selectedFilter]);

  let FilterComponent;
  let filterComponentProps = {};
  switch (selectedFilterColumn?.valueType) {
    case 'Enum':
      filterComponentProps = {
        dataOptions: selectedFilterColumn.enumValues.map(ev => ({ value: ev.value, label: ev.label ?? ev.value })),
        // Set an initialValue where none was set previously
        initialValue: get(initialValues, `${name}.filterValue`) ?? selectedFilterColumn.enumValues[0].value
      };
      FilterComponent = Select;
      break;
    case 'Date':
      filterComponentProps = {
        backendDateStandard: 'YYYY-MM-DD',
        timeZone:'UTC',
        usePortal: true
      };
      FilterComponent = Datepicker;
      break;
    default:
      FilterComponent = TextField;
      break;
  }

  return (
    <>
      <Field
        component={Select}
        dataOptions={selectifiedFilterNames}
        name={`${name}.name`}
        // Reset filter value when selecting different filter type
        onChange={
          e => (
            change(`${name}.filterValue`, undefined),
            change(`${name}.name`, e.target.value)
          )
        }
      />
      {selectedFilter &&
        <Row>
          <Col xs={6}>
            <Field
              component={Select}
              dataOptions={selectedFilterColumn.comparators.map(
                sfcc => ({ value: sfcc, label: sfcc })
              )}
              initialValue={get(initialValues, `${name}.comparator`) ?? selectedFilterColumn.comparators[0]}
              name={`${name}.comparator`}
            />
          </Col>
          <Col xs={6}>
            <Field
              {...filterComponentProps}
              component={FilterComponent}
              name={`${name}.filterValue`}
            />
          </Col>
        </Row>
      }
    </>
  );
};

export default SimpleSearchFilterField;
