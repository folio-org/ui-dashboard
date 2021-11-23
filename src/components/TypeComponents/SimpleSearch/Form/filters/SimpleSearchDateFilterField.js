import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, useForm, useFormState } from 'react-final-form';

import { get } from 'lodash';

import {
  Col,
  getLocaleDateFormat,
  KeyValue,
  InfoPopover,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import { requiredValidator } from '@folio/stripes-erm-components';

import RelativeOrAbsolute from '../../../../RelativeOrAbsolute';
import { TokenDatePicker, errorValidation } from '../../../../TokenDatePicker';

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

  const buttonProps = {
    'disabled': comparatorIsSpecialCase
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
                buttonProps={buttonProps}
                content={
                  <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.infoPopover" />
                }
                placement="top"
              />
            </div>
          }
        >
          <Field
            component={TokenDatePicker}
            name="date"
            validate={errorValidation}
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
