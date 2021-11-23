import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';

import moment from 'moment';

import {
  Col,
  Datepicker,
  getLocaleDateFormat,
  RadioButton,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

// TODO this should be exported from stripes-components
import nativeChangeField from '@folio/stripes-components/util/nativeChangeFieldValue';
import { detokenise, tokenise } from '../../tokenise';

const RADIO_VALUE_DATE = 'date';
const RADIO_VALUE_TODAY = 'today';
const RADIO_VALUE_OFFSET = 'offset';

const ERROR_INVALID_DATE_FIELD = 'ERROR_INVALID_DATE_FIELD';
const ERROR_INVALID_OFFSET = 'ERROR_INVALID_OFFSET';

const TokenDatePicker = ({
  backendDateStandard = 'YYYY-MM-DD',
  input,
  meta,
  onChange
}) => {
  // TODO handle backendDateStandard
  // Need to check if getLocaleDateFormat matches the value
  const intl = useIntl();

  const hiddenInput = useRef(null);

  // Keep track of actual value
  const [outputValue, setOutputValue] = useState('');

  // Keep track of which set of fields we're targeting
  const [radioValue, setRadioValue] = useState('');

  // Keep track of what's entered into the date field and also what we'll send to the backend
  const [dateValue, setDateValue] = useState('');
  const [backendDateValue, setBackendDateValue] = useState('');

  // Keep track of relative offset fields
  const [offset, setOffset] = useState(0);
  const [timeUnit, setTimeUnit] = useState('');
  const [offsetSign, setOffsetSign] = useState('');

  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  // onBlur and onFocus not supported at the moment, due to multiple fields in one
  const handleChange = (e) => {
    // Actually set the value in the form
    input.onChange(e);

    // If the user has set up an onChange, this will ensure that that fires
    if (onChange) {
      onChange(e, e.target.value);
    }
  };

  const setValueIfRadioMatch = useCallback((radioMatch, value) => {
    if (radioValue === radioMatch && outputValue !== value) {
      nativeChangeField(hiddenInput, false, value);
      setOutputValue(value);
    }
  }, [outputValue, radioValue]);


  const offsetValidation = useCallback((value) => {
    const valueInt = parseInt(value, 10);
    if (radioValue === RADIO_VALUE_OFFSET && (valueInt < 0 || valueInt > 999)) {
      return <FormattedMessage id="ui-dashboard.tokenDatePicker.validation.invalidOffset" />;
    }

    return undefined;
  }, [radioValue]);

  const dateValidation = useCallback((value) => {
    const acceptedFormat = getLocaleDateFormat({ intl });
    const parsedDate = moment(value, acceptedFormat);

    if (radioValue === RADIO_VALUE_DATE && (
      !value ||
      !parsedDate?._isValid ||
      parsedDate?._pf?.unusedTokens.length // Stops the user being able to enter a subset of their format;
    )) {
      return <FormattedMessage id="ui-dashboard.tokenDatePicker.validation.invalidDate" values={{ dateFormat: getLocaleDateFormat({ intl }) }} />;
    }

    return undefined;
  }, [intl, radioValue]);

  /* When internal values change, update input value
   * NativeFieldChange allows us to programatically set
   * the hidden input field and fire an onChange
   */
  useEffect(() => {
    const relativeToken = tokenise('date', { offset, offsetSign, timeUnit });
    const todayToken = tokenise('date');

    // TODO if not valid, ensure field not set
    if (offsetValidation(offset)) {
      nativeChangeField(hiddenInput, false, ERROR_INVALID_OFFSET);
      setOutputValue(ERROR_INVALID_OFFSET);
    } else if (dateValidation(dateValue)) {
      nativeChangeField(hiddenInput, false, ERROR_INVALID_DATE_FIELD);
      setOutputValue(ERROR_INVALID_DATE_FIELD);
    } else {
      setValueIfRadioMatch(RADIO_VALUE_DATE, dateValue);
      setValueIfRadioMatch(RADIO_VALUE_TODAY, todayToken);
      setValueIfRadioMatch(RADIO_VALUE_OFFSET, relativeToken);
    }
  }, [
    dateValidation,
    dateValue,
    offset,
    offsetSign,
    offsetValidation,
    outputValue,
    radioValue,
    setValueIfRadioMatch,
    timeUnit
  ]);

  const handleDateChange = (e) => {
    setDateValue(e.target.value);
    // Also if we've just changed the date, we should set the radio button accordingly (unless we're clearing the value)
    if (e.target.value) {
      setRadioValue(RADIO_VALUE_DATE);
    }
  };

  const handleOffsetChange = (e) => {
    setOffset(e.target.value);
    if (e.target.value) {
      setRadioValue(RADIO_VALUE_OFFSET);
    }
  };

  const handleTimeUnitChange = (e) => {
    setTimeUnit(e.target.value);
    if (e.target.value) {
      setRadioValue(RADIO_VALUE_OFFSET);
    }
  };

  const handleOffsetSignChange = (e) => {
    setOffsetSign(e.target.value);
    if (e.target.value) {
      setRadioValue(RADIO_VALUE_OFFSET);
    }
  };

  return (
    <>
      <Row>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_TODAY}
            label={<FormattedMessage id="ui-dashboard.tokenDatePicker.today" />}
            onChange={handleRadioChange}
            value={RADIO_VALUE_TODAY}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_OFFSET}
            label={<FormattedMessage id="ui-dashboard.tokenDatePicker.calculatedDate" />}
            onChange={handleRadioChange}
            value={RADIO_VALUE_OFFSET}
          />
        </Col>
        <Col xs={3}>
          <TextField
            error={offsetValidation(offset)}
            onChange={handleOffsetChange}
            type="number"
            validationEnabled
            value={offset}
          />
        </Col>
        <Col xs={3}>
          <Select
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
            onChange={handleTimeUnitChange}
            value={timeUnit}
          />
        </Col>
        <Col xs={3}>
          <Select
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
            onChange={handleOffsetSignChange}
            value={offsetSign}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_DATE}
            label={<FormattedMessage id="ui-dashboard.tokenDatePicker.fixedDate" />}
            onChange={handleRadioChange}
            value={RADIO_VALUE_DATE}
          />
        </Col>
        <Col xs={3}>
          <Datepicker
            error={dateValidation(dateValue)}
            onChange={handleDateChange}
            timeZone="UTC"
            usePortal
            validationEnabled
            value={dateValue}
          />
        </Col>
      </Row>
      <input
        {...input}
        ref={hiddenInput}
        hidden
        onChange={handleChange}
        type="text"
        value={outputValue}
      />
    </>
  );
};

TokenDatePicker.propTypes = {
  backendDateStandard: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func
};

export default TokenDatePicker;
