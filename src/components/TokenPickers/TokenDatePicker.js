import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';

import moment from 'moment';

import {
  Col,
  Datepicker,
  getLocaleDateFormat,
  nativeChangeFieldValue as nativeChangeField,
  RadioButton,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';

import { detokenise, tokenise } from '../../tokenise';
import { offsetValidation, dateValidation } from './validation';

import {
  RADIO_VALUE_DATE,
  RADIO_VALUE_TODAY,
  RADIO_VALUE_OFFSET,
  ERROR_INVALID_DATE_FIELD,
  ERROR_INVALID_OFFSET,
  TAB
} from './constants';

import css from './TokenPickers.css';

const TokenDatePicker = ({
  backendDateStandard = 'YYYY-MM-DD',
  disabled,
  input,
  meta,
  onChange
}) => {
  // Need to check if getLocaleDateFormat matches the value
  const intl = useIntl();
  const acceptedFormat = getLocaleDateFormat({ intl });

  // Refs
  const hiddenInput = useRef(null);

  // Stripes form components have made it impossible to do this using ref.
  const radioButtonToday = document.getElementById(`${input.name}-tokenDatePicker-radio-today`);
  const radioButtonRelative = document.getElementById(`${input.name}-tokenDatePicker-radio-relative`);

  // Keep track of actual value
  const [outputValue, setOutputValue] = useState(meta.initial ?? '');

  // InitialValue setup
  // RADIO BUTTON
  let initialRadioValue = RADIO_VALUE_TODAY;

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

    // the following is relevant when switching from a string to a date filter
    if (dateValue === 'Invalid date') {
      setDateValue('');
      setRadioValue(RADIO_VALUE_TODAY);
    }

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

  // Radio buttons by default tab to the next non-radio button focus.
  // This is fine for the relative and fixed dates, but Today needs to tab to "relative date"
  const todayKeyHandler = (e) => {
    if (e.code === TAB && !e.shiftKey) {
      radioButtonRelative.focus();
      e.preventDefault();
    }
  };

  // Likewise relative needs to be able to tab backwards to "today"
  const relativeKeyHandler = (e) => {
    if (e.code === TAB && e.shiftKey) {
      radioButtonToday.focus();
      e.preventDefault();
    }
  };

  return (
    <>
      <Row className={css.rowMargin}>
        <Col xs={3}>
          <div aria-label={intl.formatMessage({ id: 'ui-dashboard.tokenDatePicker.today' })}>
            <RadioButton
              checked={radioValue === RADIO_VALUE_TODAY}
              disabled={disabled}
              id={`${input.name}-tokenDatePicker-radio-today`}
              label={<FormattedMessage id="ui-dashboard.tokenDatePicker.today" />}
              labelClass={radioValue === RADIO_VALUE_TODAY ? css.selectedOption : css.option}
              onChange={handleRadioChange}
              onKeyDown={todayKeyHandler}
              value={RADIO_VALUE_TODAY}
            />
          </div>
        </Col>
      </Row>
      <Row className={css.rowMargin}>
        <Col xs={3}>
          <div aria-label={intl.formatMessage({ id: 'ui-dashboard.tokenDatePicker.relativeDate' })}>
            <RadioButton
              checked={radioValue === RADIO_VALUE_OFFSET}
              disabled={disabled}
              id={`${input.name}-tokenDatePicker-radio-relative`}
              label={<FormattedMessage id="ui-dashboard.tokenDatePicker.relativeDate" />}
              labelClass={radioValue === RADIO_VALUE_OFFSET ? css.selectedOption : css.option}
              onChange={handleRadioChange}
              onKeyDown={relativeKeyHandler}
              value={RADIO_VALUE_OFFSET}
            />
          </div>
        </Col>
        <Col xs={3}>
          <TextField
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
            marginBottom0
            onChange={handleOffsetSignChange}
            value={offsetSign}
          />
        </Col>
      </Row>
      <Row className={css.rowMargin}>
        <Col xs={3}>
          <div aria-label={intl.formatMessage({ id: 'ui-dashboard.tokenDatePicker.fixedDate' })}>
            <RadioButton
              checked={radioValue === RADIO_VALUE_DATE}
              disabled={disabled}
              label={<FormattedMessage id="ui-dashboard.tokenDatePicker.fixedDate" />}
              labelClass={radioValue === RADIO_VALUE_DATE ? css.selectedOption : css.option}
              onChange={handleRadioChange}
              value={RADIO_VALUE_DATE}
            />
          </div>
        </Col>
        <Col xs={6}>
          <Datepicker
            backendDateStandard={backendDateStandard}
            disabled={disabled}
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
  disabled: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func
};

export default TokenDatePicker;
