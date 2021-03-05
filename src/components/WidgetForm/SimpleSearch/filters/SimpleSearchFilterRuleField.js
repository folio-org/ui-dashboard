import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Field, useFormState } from 'react-final-form';

import {
  Col,
  KeyValue,
  Row,
  Select
} from '@folio/stripes/components';
import { get } from 'lodash';
import { requiredValidator } from '@folio/stripes-erm-components';
import SimpleSearchDateFilterField from './SimpleSearchDateFilterField';
import SimpleSearchUUIDFilterField from './SimpleSearchUUIDFilterField';


const SimpleSearchFilterRuleField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectedFilterColumn: { comparators = [], valueType } = {}
}) => {
  const { values } = useFormState();
  const intl = useIntl();

  const selectifiedComparators = comparators.map(
    sfcc => ({ value: sfcc,
      label: intl.formatMessage({
        id: `ui-dashboard.simpleSearchForm.filters.filterField.comparator.${valueType}.${sfcc}`,
        defaultMessage: sfcc
      }) })
  );

  const isSetOrUnset = get(values, `${name}.comparator`) === 'isNull' || get(values, `${name}.comparator`) === 'isNotNull';

  if (valueType === 'Date') {
    return (
      <SimpleSearchDateFilterField
        comparators={comparators}
        filterComponent={filterComponent}
        filterComponentProps={filterComponentProps}
        input={{ name }}
        selectifiedComparators={selectifiedComparators}
      />
    );
  }

  if (valueType === 'UUID') {
    return (
      <SimpleSearchUUIDFilterField
        comparators={comparators}
        filterComponent={filterComponent}
        filterComponentProps={filterComponentProps}
        input={{ name }}
        selectifiedComparators={selectifiedComparators}
      />
    );
  }

  return (
    <Row>
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
          <Field
            component={Select}
            dataOptions={selectifiedComparators}
            name={`${name}.comparator`}
            required
            validate={requiredValidator}
          />
        </KeyValue>
      </Col>
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.value" />}>
          <Field
            {...filterComponentProps}
            component={filterComponent}
            disabled={isSetOrUnset}
            name={`${name}.filterValue`}
          />
        </KeyValue>
      </Col>
    </Row>
  );
};

SimpleSearchFilterRuleField.propTypes = {
  filterComponent: PropTypes.object,
  filterComponentProps: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  selectedFilterColumn: PropTypes.shape({
    comparators: PropTypes.arrayOf(
      PropTypes.string
    )
  })
};

export default SimpleSearchFilterRuleField;
