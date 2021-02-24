import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import { Field, useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Datepicker,
  Select,
  TextField
} from '@folio/stripes/components';

import SimpleSearchFilterRuleArray from './SimpleSearchFilterRuleArray';
import { filterPresent } from './validators';

const SimpleSearchFilterField = ({ filterColumns, input: { name } }) => {
  const { initialValues, values } = useFormState();
  const { change } = useForm();

  // Create values for available filters. If label available use that, else use name
  const selectifiedFilterNames = [{ value: '', label: '', disabled: true }, ...filterColumns.map(fc => ({ value: fc.name, label: fc.label ?? fc.name }))];
  const selectedFilter = useMemo(() => get(values, `${name}.name`), [name, values]);
  const selectedFilterColumn = useMemo(() => filterColumns.find(fc => fc.name === selectedFilter), [filterColumns, selectedFilter]);

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
          e => {
            change(`${name}.filterValue`, undefined);
            change(`${name}.name`, e.target.value);
          }
        }
        validate={filterPresent}
      />
      {selectedFilter &&
        <FieldArray
          component={SimpleSearchFilterRuleArray}
          filterComponent={FilterComponent}
          filterComponentProps={filterComponentProps}
          id="simple-search-filter-rules"
          initialValue={get(initialValues, `${name}.rules`) ?? [{}]}
          name={`${name}.rules`}
          selectedFilterColumn={selectedFilterColumn}
        />
      }
    </>
  );
};

SimpleSearchFilterField.propTypes = {
  filterColumns: PropTypes.arrayOf(PropTypes.object),
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
};

export default SimpleSearchFilterField;
