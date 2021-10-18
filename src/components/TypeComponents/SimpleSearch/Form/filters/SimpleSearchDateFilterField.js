import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, useForm, useFormState } from 'react-final-form';

import { get } from 'lodash';

import {
  Col,
  Datepicker,
  getLocaleDateFormat,
  KeyValue,
  InfoPopover,
  Row,
  Select,
  TextField,
  Timepicker
} from '@folio/stripes/components';

import { requiredValidator } from '@folio/stripes-erm-components';

import RelativeOrAbsolute from '../../../../RelativeOrAbsolute';
import isComparatorSpecialCase from '../../../utilities';

/* This component handles both Date and DateTime components.
 * Will render a Date+Time picker for static and change "Today" to "Now" for variable
 */
// TODO once we make DateTime an available field we should check this component works as expected
const SimpleSearchDateFilterField = ({
  filterComponentProps,
  input: { name },
  selectifiedComparators,
  dateTime
}) => {
  const intl = useIntl();
  const { values } = useFormState();
  const { change } = useForm();

  const comparator = get(values, `${name}.comparator`);
  const comparatorIsSpecialCase = isComparatorSpecialCase(comparator);
  const relOrAbsValue = get(values, `${name}.relativeOrAbsolute`);

  useEffect(() => {
    // Ensure offset is always 0 rather than being unset
    if (get(values, `${name}.offset`) === undefined) {
      change(`${name}.offset`, 0);
    }

    // Ensure relative vs absolute is always set
    if (relOrAbsValue === undefined) {
      change(`${name}.relativeOrAbsolute`, 'today');
    }
  }, [change, name, relOrAbsValue, values]);

  const dateValidator = (value, allValues) => {
    if (get(allValues, `${name}.relativeOrAbsolute`) === 'absolute' && !value) {
      return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.invalidDate" values={{ dateFormat: getLocaleDateFormat({ intl }) }} />;
    }
    return undefined;
  };

  return (
    <Row>
      <Col xs={3}>
        <Field
          autoFocus
          component={Select}
          dataOptions={selectifiedComparators}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}
          name={`${name}.comparator`}
          required
          validate={requiredValidator}
        />
      </Col>
      <Col xs={9}>
        <KeyValue
          label={
            <div>
              <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.date" />
              <InfoPopover
                content={
                  <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.infoPopover" />
                }
                placement="top"
              />
            </div>
          }
        >
          <RelativeOrAbsolute
            absoluteComponent={
              <Row>
                <Col xs={3}>
                  <Field
                    {...(dateTime ? filterComponentProps?.dateFieldProps : filterComponentProps)}
                    ariaLabel={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.fixedDate' })}
                    component={Datepicker}
                    disabled={
                      comparatorIsSpecialCase ||
                      relOrAbsValue === 'relative' ||
                      relOrAbsValue === 'today'
                    }
                    name={dateTime ? `${name}.filterValue.date` : `${name}.filterValue`}
                    validate={dateValidator}
                  />
                </Col>
                {dateTime &&
                  <Col xs={3}>
                    <Field
                      component={Timepicker}
                      disabled={
                        comparatorIsSpecialCase ||
                        relOrAbsValue === 'relative' ||
                        relOrAbsValue === 'today'
                      }
                      name={`${name}.filterValue.time`}
                      validate={dateValidator}
                    />
                  </Col>
                }
              </Row>
            }
            disabled={comparatorIsSpecialCase}
            name={name}
            relativeComponent={
              <Row>
                <Col xs={3}>
                  <Field
                    ariaLabel={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.lengthOfTime' })}
                    component={TextField}
                    defaultValue={0}
                    disabled={
                      comparatorIsSpecialCase ||
                      relOrAbsValue === 'absolute' ||
                      relOrAbsValue === 'today'
                    }
                    name={`${name}.offset`}
                    type="number"
                    validate={value => (
                      parseInt(value, 10) < 0 || parseInt(value, 10) > 999 ?
                        <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offsetValidation" /> :
                        undefined
                    )}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    aria-label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.timeUnit" />}
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
                        value: 'M',
                        label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.months' })
                      },
                      {
                        value: 'y',
                        label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.years' })
                      }
                    ]}
                    disabled={
                      comparatorIsSpecialCase ||
                      relOrAbsValue === 'absolute' ||
                      relOrAbsValue === 'today'
                    }
                    name={`${name}.timeUnit`}
                  />
                </Col>
                <Col xs={3}>
                  <Field
                    aria-label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.beforeOrAfterToday" />}
                    component={Select}
                    dataOptions={[
                      {
                        value: 'add',
                        label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.afterToday' })
                      },
                      {
                        value: 'subtract',
                        label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.beforeToday' })
                      }
                    ]}
                    disabled={
                      comparatorIsSpecialCase ||
                      relOrAbsValue === 'absolute' ||
                      relOrAbsValue === 'today'
                    }
                    name={`${name}.offsetMethod`}
                  />
                </Col>
              </Row>
            }
            renderToday
            validateFields={
              dateTime ?
                [`${name}.filterValue.date`, `${name}.filterValue.time`] :
                [`${name}.filterValue`]
            }
          />
        </KeyValue>
      </Col>
    </Row>
  );
};

SimpleSearchDateFilterField.propTypes = {
  dateTime: PropTypes.bool,
  filterComponent: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
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
