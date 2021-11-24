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
import RelativeOrAbsolute from '../../../../RelativeOrAbsolute';
import css from './filters.css';
import isComparatorSpecialCase from '../../../utilities';
import { TokenUserPicker } from '../../../../TokenPickers';


const SimpleSearchUUIDFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  resourceType,
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

  // Set up onResourceSelected and resource for the plugin to handle
  filterComponentProps.onResourceSelected = r => {
    setResource(r);
    change(`${name}.filterValue`, r.id);
  };
  filterComponentProps.resource = resource;

  if (resourceType === 'user') {
    return (
      <>
        <Row>
          <Col xs={6}>
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
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.uuid" />}
            >
              <Field
                component={TokenUserPicker}
                disabled={comparatorIsSpecialCase}
                initialResource={resource}
                name={`${name}.filterValue`}
                onUserSelected={r => setResource(r)}
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
  }

  return (
    <>
      <Row>
        <Col xs={6}>
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
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.uuid" />}
          >
            <Field
              {...filterComponentProps}
              component={filterComponent}
              disabled={comparatorIsSpecialCase}
              name={`${name}.filterValue`}
              validate={(value) => {
                if (!value) {
                  return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.uuidFilterField.emptyWarning" />;
                }
                return undefined;
              }}
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
