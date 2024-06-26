import { FormattedMessage } from 'react-intl';
import { RADIO_VALUE_DATE, RADIO_VALUE_OFFSET, RADIO_VALUE_USER } from './constants';

const offsetValidation = (value, radioValue) => {
  const valueInt = parseInt(value, 10);
  if (radioValue === RADIO_VALUE_OFFSET && (valueInt < 0 || valueInt > 999)) {
    return <FormattedMessage id="ui-dashboard.tokenDatePicker.validation.invalidOffset" />;
  }

  return undefined;
};

const dateValidation = (value, radioValue, dateDayjs, dateFormat) => {
  if (radioValue === RADIO_VALUE_DATE && (!value || !dateDayjs?.isValid())) {
    return (
      <FormattedMessage
        id="ui-dashboard.tokenDatePicker.validation.invalidDate"
        values={{ dateFormat }}
      />
    );
  }

  return undefined;
};

const userValidation = (value, radioValue) => {
  if (radioValue === RADIO_VALUE_USER && !value) {
    return <FormattedMessage id="ui-dashboard.tokenUserPicker.validation.invalidUser" />;
  }

  return undefined;
};


const errorValidation = (value) => {
  if (value?.match(/ERROR_/g)) {
    return "this shouldn't be happening";
  }

  return undefined;
};

export {
  dateValidation,
  errorValidation,
  offsetValidation,
  userValidation
};
