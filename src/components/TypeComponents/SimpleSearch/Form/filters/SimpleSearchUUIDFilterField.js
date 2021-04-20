import React, { useEffect } from 'react';
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
import css from './SimpleSearchFilterFields.css';


const SimpleSearchUUIDFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  resource,
  selectifiedComparators
}) => {
  const { values } = useFormState();
  const { change } = useForm();

  const isSetOrUnset = get(values, `${name}.comparator`) === 'isNull' || get(values, `${name}.comparator`) === 'isNotNull';
  const relOrAbsValue = get(values, `${name}.relativeOrAbsolute`);

  useEffect(() => {
    // Ensure relative vs absolute is always  in the case resource is user
    if (resource === 'user' && relOrAbsValue === undefined) {
      change(`${name}.relativeOrAbsolute`, 'relative');
    }
  }, [change, name, relOrAbsValue, resource, values]);

  // Set up onResourceSelected using setResource passed down
  filterComponentProps.onResourceSelected = r => {
    filterComponentProps.setResource(r);
    change(`${name}.filterValue`, r.id);
  };

  if (resource === 'user') {
    return (
      <Row>
        <Col xs={6}>
          <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
            <Field
              component={Select}
              dataOptions={selectifiedComparators}
              defaultValue={selectifiedComparators[0]?.value}
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
            <RelativeOrAbsolute
              absoluteComponent={
                <div className={relOrAbsValue === 'absolute' ? css.absoluteSelected : null}>
                  <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.uuidFilterField.currentUser" />
                </div>
              }
              disabled={isSetOrUnset}
              name={name}
              relativeComponent={
                <Field
                  {...filterComponentProps}
                  component={filterComponent}
                  disabled={
                    isSetOrUnset ||
                    relOrAbsValue === 'relative'
                  }
                  name={`${name}.filterValue`}
                  validate={(value, allValues) => {
                    if (get(allValues, `${name}.relativeOrAbsolute`) === 'absolute' && !value) {
                      return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.uuidFilterField.absoluteValueWarning" />;
                    }
                    return undefined;
                  }}
                />
              }
              validateFields={[`${name}.filterValue`]}
            />
          </KeyValue>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col xs={6}>
        <KeyValue label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}>
          <Field
            component={Select}
            dataOptions={selectifiedComparators}
            defaultValue={selectifiedComparators[0]?.value}
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
            disabled={isSetOrUnset}
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
  );

};

SimpleSearchUUIDFilterField.propTypes = {
  filterComponent: PropTypes.object,
  filterComponentProps: PropTypes.object,
  input: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  selectifiedComparators: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
  }))
};

export default SimpleSearchUUIDFilterField;
