import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { Field, useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Datepicker,
  KeyValue,
  Select,
  TextField
} from '@folio/stripes/components';

import Registry from '@folio/plugin-resource-registry';

import SimpleSearchFilterRuleArray from './SimpleSearchFilterRuleArray';

const SimpleSearchFilterField = ({ filterColumns, id, input: { name } }) => {
  const { values } = useFormState();
  console.log("VALUES: %o", values);
  const { change } = useForm();

  // Resource variable for UUID case
  const [resource, setResource] = useState({});

  // Create values for available filters. If label available use that, else use name
  const selectifiedFilterNames = [{ value: '', label: '', disabled: true }, ...filterColumns.map(fc => ({ value: fc.name, label: fc.label ?? fc.name }))];

  // Get currently selectedFilter and then find the full filterColumn from that value
  // TODO is there a better way to pass extra values on selects and get that data back?
  const selectedFilter = useMemo(() => get(values, `${name}.name`), [name, values]);
  const selectedFilterColumn = useMemo(() => filterColumns.find(fc => fc.name === selectedFilter), [filterColumns, selectedFilter]);

  let FilterComponent;
  let filterComponentProps = {};

  switch (selectedFilterColumn?.valueType) {
    case 'Enum':
      filterComponentProps = {
        dataOptions: selectedFilterColumn.enumValues.map(ev => ({ value: ev.value, label: ev.label ?? ev.value })),
        // Set an initialValue where none was set previously
        defaultValue: selectedFilterColumn.enumValues[0].value,
        id
      };
      FilterComponent = Select;
      break;
    case 'Date':
      filterComponentProps = {
        backendDateStandard: 'YYYY-MM-DD',
        id,
        timeZone:'UTC',
        usePortal: true
      };
      FilterComponent = Datepicker;
      break;

    case 'UUID': {
      const resourceReg = Registry.getResource(selectedFilterColumn.resource);
      const LookupComponent = resourceReg?.getLookupComponent();
      if (LookupComponent) {
        filterComponentProps = {
          id,
          onResourceSelected: r => {
            setResource(r);
            change(`${name}.filterValue`, r.id);
          },
          resourceName: get(values, `${name}.resourceType`),
          resource,
          setResource
        };
        FilterComponent = LookupComponent;
      } else {
        FilterComponent = TextField;
      }
      break;
    }
    default:
      FilterComponent = TextField;
      break;
  }

  // Keep the hidden form field up to date
  useEffect(() => {
    change(`${name}.fieldType`, selectedFilterColumn?.valueType);
    change(`${name}.resourceType`, selectedFilterColumn?.resource);
  }, [change, name, selectedFilterColumn]);

  return (
    <>
      <KeyValue
        data-testid="simple-search-filter-field-filter-by"
        label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterBy" />}
      >
        <Field
          component={Select}
          dataOptions={selectifiedFilterNames}
          name={`${name}.name`}
          // Reset filter value when selecting different filter type
          onChange={
            e => {
              change(`${name}.rules`, [{}]);
              change(`${name}.name`, e.target.value);
            }
          }
        />
        <Field
          name={`${name}.fieldType`}
          render={() => (null)}
          value={selectedFilterColumn?.valueType}
        />
        <Field
          name={`${name}.resourceType`}
          render={() => (null)}
          value={selectedFilterColumn?.resource}
        />
      </KeyValue>
      {selectedFilter &&
        <FieldArray
          component={SimpleSearchFilterRuleArray}
          filterComponent={FilterComponent}
          filterComponentProps={filterComponentProps}
          id="simple-search-filter-rules"
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
