import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { useFormState, useForm } from 'react-final-form';

import {
  Button,
  Icon,
  Pane,
  Paneset,
  PaneFooter,
} from '@folio/stripes/components';

import DragAndDropFieldArray from '../DragAndDropFieldArray'

const ReorderForm = ({
  onClose,
  onSubmit,
  pristine,
  submitting,
}) => {
  const { values } = useFormState();
  console.log("Values: %o", values)
  const { change } = useForm();

  // Keep weights up to date with list index in form
  useEffect(() => {
    if (values?.widgets) {
      values.widgets.forEach((wi, index) => {
        if (wi.weight !== index) {
          change(`widgets[${index}].weight`, index);
        }
      });
    }
  }, [values, change]);

  const makeOnDragEndFunction = fields => result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // Move field to correct place in the list
    fields.move(result.source.index, result.destination.index);
  };


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
        centerContent
        defaultWidth="100%"
        footer={renderPaneFooter()}
        id="pane-reorder-form"
        paneTitle={<FormattedMessage id="ui-dashboard.dashboard.reorderForm.paneTitle" />}
      >
        <FieldArray
          name="widgets"
          component={DragAndDropFieldArray}
        >
          {(name) => (
            <Icon
              icon="drag-drop"
            >
              {get(values, `${name}.name`)}
            </Icon>
          )}
        </FieldArray>
      </Pane>
    </Paneset>
  );
};

ReorderForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

export default ReorderForm;


