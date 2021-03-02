import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field, useFormState } from 'react-final-form';

import {
  Col,
  Checkbox,
  KeyValue,
  Row,
  Select
} from '@folio/stripes/components';
import { get } from 'lodash';

const SimpleSearchFilterRuleField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectedFilterColumn: { comparators = [] } = {}
}) => {
  const { values } = useFormState();


  // Check if isNull is an option, because we have to deal with that differently
  const hasIsNull = comparators?.includes('isNull');
  const comparatorsWithoutIsNull = comparators;
  if (hasIsNull) {
    const indexOfIsNull = comparatorsWithoutIsNull.indexOf('isNull');
    comparatorsWithoutIsNull.splice(indexOfIsNull, 1);
  }

  const selectifiedComparators = comparatorsWithoutIsNull.map(
    sfcc => ({ value: sfcc, label: sfcc })
  );

  return (
    <Row>
      <Col xs={hasIsNull ? 4 : 6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
          <Field
            component={Select}
            dataOptions={selectifiedComparators}
            defaultValue={comparators[0]}
            disabled={get(values, `${name}.isNull`)}
            name={`${name}.comparator`}
          />
        </KeyValue>
      </Col>
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.value" />}>
          <Field
            {...filterComponentProps}
            component={filterComponent}
            disabled={get(values, `${name}.isNull`)}
            name={`${name}.filterValue`}
          />
        </KeyValue>
      </Col>
      { hasIsNull &&
        <Col xs={2}>
          <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.isNull" />}>
            <Field
              component={Checkbox}
              name={`${name}.isNull`}
              type="checkbox"
            />
          </KeyValue>
        </Col>
      }
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
