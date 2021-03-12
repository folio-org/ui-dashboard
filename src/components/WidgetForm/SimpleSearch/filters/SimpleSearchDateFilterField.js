import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { FormattedMessage, useIntl } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';

import {
  Col,
  KeyValue,
  RadioButton,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import { get } from 'lodash';
import { requiredValidator } from '@folio/stripes-erm-components';
import css from './SimpleSearchDateFilterField.css';


const SimpleSearchDateFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectifiedComparators
}) => {
  const intl = useIntl();
  const { values } = useFormState();
  const { change } = useForm();

  const isSetOrUnset = get(values, `${name}.comparator`) === 'isNull' || get(values, `${name}.comparator`) === 'isNotNull';
  const relOrAbsValue = get(values, `${name}.relativeOrAbsolute`);

  useEffect(() => {
    // Ensure offset is always 0 rather than being unset
    if (get(values, `${name}.offset`) === undefined) {
      change(`${name}.offset`, 0);
    }

    // Ensure relative vs absolute is always set
    if (relOrAbsValue === undefined) {
      change(`${name}.relativeOrAbsolute`, 'relative');
    }
  }, [change, name, relOrAbsValue, values]);

  return (
    <Row>
      <Col xs={3}>
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
      <Col xs={3}>
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
                  validateFields={[`${name}.filterValue`]}
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
                <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.today" />
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
                  validateFields={[`${name}.filterValue`]}
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
                  validate={(value, allValues) => {
                    if (get(allValues, `${name}.relativeOrAbsolute`) === 'absolute' && !value) {
                      return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.absoluteValueWarning" />;
                    }
                    return undefined;
                  }}
                />
              </div>
            </div>
          </Row>
        </KeyValue>
      </Col>
      <Col xs={2}>
        <Field
          component={Select}
          dataOptions={[
            {
              value: 'add',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.add' })
            },
            {
              value: 'subtract',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.subtract' })
            }
          ]}
          disabled={
            isSetOrUnset ||
            relOrAbsValue !== 'relative'
          }
          label={
            <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offsetMethod" />
          }
          name={`${name}.offsetMethod`}
        />
      </Col>
      <Col xs={2}>
        <Field
          component={TextField}
          defaultValue={0}
          disabled={
            isSetOrUnset ||
            relOrAbsValue !== 'relative'
          }
          label={
            <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offset" />
          }
          name={`${name}.offset`}
          type="number"
          validate={value => (
            parseInt(value, 10) >= 0 ?
              undefined :
              <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offsetMustBePositive" />
          )}
        />
      </Col>
      <Col xs={2}>
        <Field
          component={Select}
          dataOptions={[
            {
              value: 'd',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.days' })
            },
            {
              value: 'w',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.weeks' })
            },
            {
              value: 'm',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.months' })
            },
            {
              value: 'y',
              label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.years' })
            }
          ]}
          disabled={
            isSetOrUnset ||
            relOrAbsValue !== 'relative'
          }
          label={
            <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.timeUnit" />
          }
          name={`${name}.timeUnit`}
        />
      </Col>
    </Row>
  );
};

SimpleSearchDateFilterField.propTypes = {
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

export default SimpleSearchDateFilterField;
