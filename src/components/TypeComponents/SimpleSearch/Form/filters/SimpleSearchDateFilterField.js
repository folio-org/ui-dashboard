import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import { requiredValidator } from '@folio/stripes-erm-components';

import RelativeOrAbsolute from '../../../../RelativeOrAbsolute';
import css from './SimpleSearchFilterFields.css';
import isComparatorSpecialCase from '../../../utilities';

const SimpleSearchDateFilterField = ({
  filterComponent,
  filterComponentProps,
  input: { name },
  selectifiedComparators
}) => {
  const intl = useIntl();
  const { values } = useFormState();
  const { change } = useForm();

  const comparator = get(values, `${name}.comparator`);
  const comparatorIsSpecialCase = isComparatorSpecialCase(comparator);
  const relOrAbsValue = get(values, `${name}.relativeOrAbsolute`);

  useEffect(() => {
    // Ensure offset is always 0 rather than being unset
    if (values?.[name?.offset] === undefined) {
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
        <Field
          component={Select}
          dataOptions={selectifiedComparators}
          defaultValue={selectifiedComparators[0]?.value}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.comparator" />}
          name={`${name}.comparator`}
          required
          validate={requiredValidator}
        />
      </Col>
      <Col xs={3}>
        <KeyValue
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.date" />}
        >
          <RelativeOrAbsolute
            absoluteComponent={
              <div className={relOrAbsValue === 'absolute' ? css.absoluteSelected : null}>
                <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.today" />
              </div>
            }
            disabled={comparatorIsSpecialCase}
            name={name}
            relativeComponent={
              <Field
                {...filterComponentProps}
                component={filterComponent}
                disabled={
                  comparatorIsSpecialCase ||
                  relOrAbsValue === 'relative'
                }
                name={`${name}.filterValue`}
                validate={(value, allValues) => {
                  if (allValues?.[name?.relativeOrAbsolute] === 'absolute' && !value) {
                    return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.absoluteValueWarning" />;
                  }
                  return undefined;
                }}
              />
            }
            validateFields={[`${name}.filterValue`]}
          />
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
            comparatorIsSpecialCase ||
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
            comparatorIsSpecialCase ||
            relOrAbsValue !== 'relative'
          }
          label={
            <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offset" />
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
