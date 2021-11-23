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
import { offsetValidation, dateValidation } from './validation';

import {
  RADIO_VALUE_DATE,
  RADIO_VALUE_TODAY,
  RADIO_VALUE_OFFSET,
  ERROR_INVALID_DATE_FIELD,
  ERROR_INVALID_OFFSET
} from './constants';

import css from './TokenDatePicker.css';

const TokenDatePicker = ({
  backendDateStandard = 'YYYY-MM-DD',
  input,
  meta,
  onChange
}) => {
  // TODO handle backendDateStandard
  // Need to check if getLocaleDateFormat matches the value
  const intl = useIntl();
  const acceptedFormat = getLocaleDateFormat({ intl });

  const hiddenInput = useRef(null);

  // Keep track of actual value
  const [outputValue, setOutputValue] = useState(meta.initial ?? '');

  // InitialValue setup
  // RADIO BUTTON
  let initialRadioValue = '';

  // FIXED DATE FIELD
  let initialDateMoment = {};
  let initialDateValue = '';
  let initialBackendDateValue = '';

  // OFFSET DATE FIELD
  let initialOffset = 0;
  let initialTimeUnit = '';
  let initialOffsetSign = '';

  if (meta.initial) {
    const [tokenType, tokenParams] = detokenise(meta.initial);
    if (tokenType === 'date' && Object.keys(tokenParams).length) {
      initialRadioValue = RADIO_VALUE_OFFSET;
      initialOffset = tokenParams.offset ?? 0;
      initialTimeUnit = tokenParams.timeUnit ?? '';
      initialOffsetSign = tokenParams.offsetSign ?? '';
    } else if (tokenType === 'date') {
      initialRadioValue = RADIO_VALUE_TODAY;
    } else {
      initialBackendDateValue = meta.initial;
      initialRadioValue = RADIO_VALUE_DATE;
      initialDateMoment = moment(initialBackendDateValue, backendDateStandard);
      initialDateValue = initialDateMoment.format(acceptedFormat);
    }
  }

  // Keep track of which set of fields we're targeting
  const [radioValue, setRadioValue] = useState(initialRadioValue);

  // Keep track of what's entered into the date field and also what we'll send to the backend
  const [dateValue, setDateValue] = useState(initialDateValue);
  const [dateMoment, setDateMoment] = useState(initialDateMoment);
  const [backendDateValue, setBackendDateValue] = useState(initialBackendDateValue);

  // Keep track of relative offset fields
  const [offset, setOffset] = useState(initialOffset);
  const [timeUnit, setTimeUnit] = useState(initialTimeUnit);
  const [offsetSign, setOffsetSign] = useState(initialOffsetSign);

  // onBlur and onFocus not supported at the moment, due to multiple fields in one
  const handleChange = (e) => {
    // Actually set the value in the form
    input.onChange(e);

    // If the user has set up an onChange, this will ensure that that fires
    if (onChange) {
      onChange(e, e.target.value);
    }
  };

  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };

  const changeOutputValue = (value) => {
    nativeChangeField(hiddenInput, false, value);
    setOutputValue(value);
  };

  const setValueIfRadioMatch = useCallback((radioMatch, value) => {
    if (radioValue === radioMatch && outputValue !== value) {
      changeOutputValue(value);
    }
  }, [outputValue, radioValue]);

  /* When internal values change, update input value
   * NativeFieldChange allows us to programatically set
   * the hidden input field and fire an onChange
   */
  useEffect(() => {
    const relativeToken = tokenise('date', { offset, offsetSign, timeUnit });
    const todayToken = tokenise('date');

    if (offsetValidation(offset, radioValue)) {
      changeOutputValue(ERROR_INVALID_OFFSET);
    } else if (dateValidation(dateValue, radioValue, dateMoment, acceptedFormat)) {
      changeOutputValue(ERROR_INVALID_DATE_FIELD);
    } else {
      setValueIfRadioMatch(RADIO_VALUE_DATE, backendDateValue);
      setValueIfRadioMatch(RADIO_VALUE_TODAY, todayToken);
      setValueIfRadioMatch(RADIO_VALUE_OFFSET, relativeToken);
    }
  }, [
    acceptedFormat,
    backendDateValue,
    dateMoment,
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
    const parsedDate = moment(e.target.value, acceptedFormat);
    setDateMoment(parsedDate);
    setBackendDateValue(parsedDate.format(backendDateStandard));

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
      <Row className={css.rowMargin}>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_TODAY}
            label={<FormattedMessage id="ui-dashboard.tokenDatePicker.today" />}
            onChange={handleRadioChange}
            value={RADIO_VALUE_TODAY}
          />
        </Col>
      </Row>
      <Row className={css.rowMargin}>
        <Col xs={2}>
          <RadioButton
            checked={radioValue === RADIO_VALUE_OFFSET}
            label={<FormattedMessage id="ui-dashboard.tokenDatePicker.relativeDate" />}
            onChange={handleRadioChange}
            value={RADIO_VALUE_OFFSET}
          />
        </Col>
        <Col xs={3}>
          <TextField
            error={offsetValidation(offset, radioValue)}
            marginBottom0
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
            marginBottom0
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
            marginBottom0
            onChange={handleOffsetSignChange}
            value={offsetSign}
          />
        </Col>
      </Row>
      <Row className={css.rowMargin}>
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
            backendDateStandard={backendDateStandard}
            error={dateValidation(dateValue, radioValue, dateMoment, acceptedFormat)}
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
