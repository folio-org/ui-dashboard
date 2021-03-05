import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';

import {
  Col,
  KeyValue,
  RadioButton,
  Row,
  Select
} from '@folio/stripes/components';

import { get } from 'lodash';
import { requiredValidator } from '@folio/stripes-erm-components';
import css from './SimpleSearchDateFilterField.css';


const SimpleSearchUUIDFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectifiedComparators
}) => {
  const { values } = useFormState();
  const { change } = useForm();

  const isSetOrUnset = get(values, `${name}.comparator`) === 'isNull' || get(values, `${name}.comparator`) === 'isNotNull';
  const relOrAbsValue = get(values, `${name}.relativeOrAbsolute`);

  useEffect(() => {
    // Ensure relative vs absolute is always set
    if (relOrAbsValue === undefined) {
      change(`${name}.relativeOrAbsolute`, 'relative');
    }
  }, [change, name, relOrAbsValue, values]);

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
        <KeyValue
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.value" />}
        >
          <Row>
            <div className={css.flexContainer}>
              <div className={css.radioButton}>
                <Field
                  defaultValue="absolute"
                  name={`${name}.relativeOrAbsolute`}
                  render={({ input }) => {
                    return (
                      <RadioButton
                        checked={input.checked}
                        disabled={isSetOrUnset}
                        id="relative"
                        name={input.name}
                        onChange={input.onChange}
                        value="relative"
                      />
                    );
                  }}
                  type="radio"
                  value="relative"
                />
              </div>
              <div className={
                classnames(
                  css.item,
                  { [css.absoluteSelected]: relOrAbsValue === 'absolute' }
                )
              }
              >
                <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.uuidFilterField.currentUser" />
              </div>
            </div>
          </Row>
          <Row>
            <div className={css.flexContainer}>
              <div className={css.radioButton}>
                <Field
                  name={`${name}.relativeOrAbsolute`}
                  render={({ input }) => {
                    return (
                      <RadioButton
                        checked={input.checked}
                        disabled={isSetOrUnset}
                        id="absolute"
                        name={input.name}
                        onChange={input.onChange}
                        value="absolute"
                      />
                    );
                  }}
                  type="radio"
                  value="absolute"
                />
              </div>
              <div className={css.item}>
                <Field
                  {...filterComponentProps}
                  component={filterComponent}
                  disabled={
                    isSetOrUnset ||
                    relOrAbsValue === 'relative'
                  }
                  name={`${name}.filterValue`}
                />
              </div>
            </div>
          </Row>
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
