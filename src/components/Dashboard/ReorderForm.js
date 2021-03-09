import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Field, useFormState, useForm } from 'react-final-form';

import {
  Button,
  Col,
  KeyValue,
  Pane,
  Paneset,
  PaneFooter,
  Row
} from '@folio/stripes/components';

const ReorderForm = ({
  dashboard,
  onClose,
  onSubmit,
  pristine,
  submitting,
}) => {

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-reorder-dashboard"
            marginBottom0
            onClick={onSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={onClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
      />
    );
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        footer={renderPaneFooter()}
        id="pane-reorder-form"
        paneTitle={"THIS IS A TEST, CHANGE LATER"}
      >
        <p> Order change screen </p>
        {JSON.stringify(dashboard, null, 2)}
      </Pane>
    </Paneset>
  );
}

ReorderForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ReorderForm;


