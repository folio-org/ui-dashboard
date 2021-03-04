import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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


const SimpleSearchFilterRuleField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectedFilterColumn: { comparators = [], valueType } = {}
}) => {
  const { values } = useFormState();

  const selectifiedComparators = comparators.map(
    sfcc => ({ value: sfcc, label: sfcc })
  );

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
            disabled={get(values, `${name}.comparator`) === 'isNull'}
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
