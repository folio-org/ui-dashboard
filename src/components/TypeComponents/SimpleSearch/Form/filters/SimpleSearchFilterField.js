import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { Field, useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Checkbox,
  KeyValue,
  Select,
  TextField
} from '@folio/stripes/components';

import { Registry } from '@folio/handler-stripes-registry';

import SimpleSearchFilterRuleArray from './SimpleSearchFilterRuleArray';
import { errorValidation, TokenDatePicker, TokenUserPicker } from '../../../../TokenPickers';

const SimpleSearchFilterField = ({ filterColumns, id, input: { name } }) => {
  const { values } = useFormState();
  const { change } = useForm();

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
    // Currently treat DateTime as if it were a Date -- datetime handling to come
    case 'Date':
    case 'DateTime':
      filterComponentProps = {
        backendDateStandard: 'YYYY-MM-DD',
        validate: errorValidation
      };
      FilterComponent = TokenDatePicker;
      break;
    case 'UUID': {
      const resourceReg = Registry.getResource(selectedFilterColumn.resource);
      FilterComponent = resourceReg?.getLookupComponent() ?? TextField;

      const resourceName = get(values, `${name}.resourceType`);
      filterComponentProps = {
        id,
        validate: (value) => {
          if (!value) {
            return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.uuidFilterField.emptyWarning" />;
          }
          return undefined;
        }
      };

      if (resourceName === 'user') {
        FilterComponent = TokenUserPicker;
        filterComponentProps = {
          id,
          validate: errorValidation
        };
      }
      break;
    }
    case 'Boolean':
      filterComponentProps = {
        type: 'checkbox',
        defaultValue: false
      };
      FilterComponent = Checkbox;
      break;
    default:
      FilterComponent = TextField;
      break;
  }

  // Keep the hidden form fields up to date
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
          autoFocus
          component={Select}
          dataOptions={selectifiedFilterNames}
          name={`${name}.name`}
          // Reset filter value when selecting different filter type
          onChange={
            e => {
              change(`${name}.rules`, [{
                comparator: selectedFilterColumn?.[0]
              }]);
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
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
};

export default SimpleSearchFilterField;
