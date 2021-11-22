import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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

const TokenDatePicker = ({ input, meta, onChange }) => {
  //TODO handle backendDateStandard and non valid date...
  const intl = useIntl();

  const hiddenInput = useRef(null);

  // Keep track of actual value
  const [outputValue, setOutputValue] = useState('');

  // Keep track of which set of fields we're targeting
  const [radioValue, setRadioValue] = useState('');

  // Keep track of date field
  const [dateValue, setDateValue] = useState('');

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

  /* When internal values change, update input value
   * NativeFieldChange allows us to programatically set
   * the hidden input field and fire an onChange
   */
  useEffect(() => {
    const relativeToken = tokenise('date', { offset, offsetSign, timeUnit });
    const todayToken = tokenise('date');
    setValueIfRadioMatch(RADIO_VALUE_DATE, dateValue);
    setValueIfRadioMatch(RADIO_VALUE_TODAY, todayToken);
    setValueIfRadioMatch(RADIO_VALUE_OFFSET, relativeToken);
  }, [
    dateValue,
    offset,
    offsetSign,
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

  const offsetValid = (value) => {
    const valueInt = parseInt(value, 10);
    if (radioValue === RADIO_VALUE_OFFSET && (valueInt < 0 || valueInt > 999)) {
      return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.offsetValidation" />;
    }

    return undefined;
  };

  const dateValid = (value) => {
    if (radioValue === RADIO_VALUE_DATE && !value) {
      return <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.dateFilterField.invalidDate" values={{ dateFormat: getLocaleDateFormat({ intl }) }} />;
    }
    return undefined;
  };

  return (
    <>
      <Row>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_TODAY}
            label="today"
            onChange={handleRadioChange}
            value={RADIO_VALUE_TODAY}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_OFFSET}
            label=" "
            onChange={handleRadioChange}
            value={RADIO_VALUE_OFFSET}
          />
        </Col>
        <Col xs={3}>
          <TextField
            error={offsetValid(offset)}
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
            label="date"
            onChange={handleRadioChange}
            value={RADIO_VALUE_DATE}
          />
        </Col>
        <Col xs={3}>
          <Datepicker
            backendDateStandard="YYYY-MM-DD"
            error={dateValid(dateValue)}
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

export default TokenDatePicker;
