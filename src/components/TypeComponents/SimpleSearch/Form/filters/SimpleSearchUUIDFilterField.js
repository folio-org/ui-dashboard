import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';

import {
  Col,
  KeyValue,
  Row,
  Select
} from '@folio/stripes/components';

import { get } from 'lodash';
import { requiredValidator } from '@folio/stripes-erm-components';
import isComparatorSpecialCase from '../../../utilities';


const SimpleSearchUUIDFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectifiedComparators
}) => {
  const { initialValues, values } = useFormState();
  const { change } = useForm();

  const comparator = get(values, `${name}.comparator`);
  const comparatorIsSpecialCase = isComparatorSpecialCase(comparator);

  // Resource variable for UUID case
  const [resource, setResource] = useState(get(initialValues, `${name}.resource`));
  // This field is used when editing the widget, to display existing resource data
  useEffect(() => {
    change(`${name}.resource`, resource);
  }, [change, name, resource]);

  // Set up filterComponentProps with resource specific stuff
  const fcp = {
    ...filterComponentProps,
    onResourceSelected: r => {
      setResource(r);
      change(`${name}.filterValue`, r.id);
    }, // For any lookups that are not users
    onUserSelected: r => setResource(r), // for users
    resource,
  };

  return (
    <>
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
            <Field
              autoFocus
              component={Select}
              dataOptions={selectifiedComparators}
              name={`${name}.comparator`}
              required
              validate={requiredValidator}
            />
          </KeyValue>
        </Col>
        <Col xs={9}>
          <KeyValue
            label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.uuid" />}
          >
            <Field
              {...fcp}
              component={filterComponent}
              disabled={comparatorIsSpecialCase}
              name={`${name}.filterValue`}
            />
          </KeyValue>
        </Col>
      </Row>
      <Field
        name={`${name}.resource`}
        render={() => (null)}
        value={resource}
      />
    </>
  );
};

SimpleSearchUUIDFilterField.propTypes = {
  filterComponent: PropTypes.object,
  filterComponentProps: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  resourceType: PropTypes.string,
  selectifiedComparators: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  }))
};

export default SimpleSearchUUIDFilterField;
