import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';

import { useModules, useStripes } from '@folio/stripes/core';

import {
  Col,
  nativeChangeFieldValue as nativeChangeField,
  RadioButton,
  Row,
  TextField
} from '@folio/stripes/components';

import UserLookup from '../UserLookup';
import { detokenise, tokenise } from '../../tokenise';
import { userValidation } from './validation';

import {
  RADIO_VALUE_ME,
  RADIO_VALUE_USER,
  ERROR_INVALID_USER_FIELD,
  TAB
} from './constants';

import css from './TokenPickers.css';

const TokenUserPicker = ({
  disabled,
  input,
  meta,
  onChange,
  onUserSelected,
  resource
}) => {
  const intl = useIntl();
  // Set up stripes to handle plugin rendering
  const stripes = useStripes();
  const { plugin: modulePlugins } = useModules();

  // TODO isEnabled for plugins/modules is something that should be exposed, perhaps via the registry
  const findUserPluginAvailable = !!modulePlugins?.find(p => p.pluginType === 'find-user') &&
    stripes.hasPerm('module.ui-plugin-find-user.enabled');

  // Refs
  const hiddenInput = useRef(null);

  // Set up initialValues
  let initialRadioValue = RADIO_VALUE_ME;
  let initialUser = '';
  if (meta.initial) {
    const [tokenType] = detokenise(meta.initial);
    if (tokenType === 'user') {
      initialRadioValue = RADIO_VALUE_ME;
    } else {
      initialRadioValue = RADIO_VALUE_USER;
      initialUser = resource;
    }
  }

  // Keep track of which set of fields we're targeting
  const [radioValue, setRadioValue] = useState(initialRadioValue);
  const [user, setUser] = useState(initialUser ?? '');

  const handleUserLookupChange = (usr) => {
    if (onUserSelected) {
      onUserSelected(usr);
    }

    setUser(usr);

    if (usr) {
      setRadioValue(RADIO_VALUE_USER);
    }
  };

  const handleUserTextChange = (e) => {
    setUser({ id: e.target.value });

    if (e.target.value) {
      setRadioValue(RADIO_VALUE_USER);
    }
  };

  let UserSelectComponent;
  let userSelectProps = {};
  if (findUserPluginAvailable) {
    UserSelectComponent = UserLookup;
    userSelectProps = {
      disabled,
      id: `${input.name}-user-lookup`,
      input: {
        name: `${input.name}-user-lookup`,
        value: user
      },
      onResourceSelected: handleUserLookupChange,
      resource: user
    };
  } else {
    // If we can't use that plugin for whatever reason, ensure we fallback to TextField
    UserSelectComponent = TextField;
    userSelectProps = {
      disabled,
      id: `${input.name}-user-textfield`,
      onChange: handleUserTextChange,
    };
  }

  // Stripes form components have made it impossible to do this using ref.
  const radioButtonMe = document.getElementById(`${input.name}-tokenDatePicker-radio-me`);
  const radioButtonUser = document.getElementById(`${input.name}-tokenDatePicker-radio-user`);

  // Keep track of actual value
  const [outputValue, setOutputValue] = useState(meta.initial ?? '');

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
    const meToken = tokenise('user', {});

    if (userValidation(user.id, radioValue)) {
      changeOutputValue(ERROR_INVALID_USER_FIELD);
    } else {
      setValueIfRadioMatch(RADIO_VALUE_ME, meToken);
      setValueIfRadioMatch(RADIO_VALUE_USER, user?.id);
    }
  }, [
    radioValue,
    user,
    setValueIfRadioMatch,
  ]);

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

  // Radio buttons by default tab to the next non-radio button focus.
  // Me needs to tab to "fixed user"
  const meKeyHandler = (e) => {
    if (e.code === TAB && !e.shiftKey) {
      radioButtonUser.focus();
      e.preventDefault();
    }
  };

  // Likewise fixed user needs to be able to tab backwards to "me"
  const userKeyHandler = (e) => {
    if (e.code === TAB && e.shiftKey) {
      radioButtonMe.focus();
      e.preventDefault();
    }
  };

  return (
    <>
      <Row className={css.rowMargin}>
        <Col xs={2}>
          <div aria-label={intl.formatMessage({ id: 'ui-dashboard.tokenUserPicker.me' })}>
            <RadioButton
              checked={radioValue === RADIO_VALUE_ME}
              id={`${input.name}-tokenDatePicker-radio-me`}
              label={<FormattedMessage id="ui-dashboard.tokenUserPicker.me" />}
              labelClass={radioValue === RADIO_VALUE_ME ? css.selectedOption : css.option}
              onChange={handleRadioChange}
              onKeyDown={meKeyHandler}
              value={RADIO_VALUE_ME}
            />
          </div>
        </Col>
      </Row>
      <Row className={css.rowMargin}>
        <Col xs={2}>
          <div aria-label={intl.formatMessage({ id: 'ui-dashboard.tokenUserPicker.user' })}>
            <RadioButton
              checked={radioValue === RADIO_VALUE_USER}
              id={`${input.name}-tokenDatePicker-radio-user`}
              label={<FormattedMessage id="ui-dashboard.tokenUserPicker.user" />}
              labelClass={radioValue === RADIO_VALUE_USER ? css.selectedOption : css.option}
              onChange={handleRadioChange}
              onKeyDown={userKeyHandler}
              value={RADIO_VALUE_USER}
            />
          </div>
        </Col>
        <Col xs={10}>
          <UserSelectComponent
            {...userSelectProps}
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

TokenUserPicker.propTypes = {
  disabled: PropTypes.bool,
  input: PropTypes.object,
  meta: PropTypes.object,
  onChange: PropTypes.func,
  onUserSelected: PropTypes.func,
  resource: PropTypes.object
};

export default TokenUserPicker;
