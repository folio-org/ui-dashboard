import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

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

import DragAndDropFieldArray from '../DragAndDropFieldArray';
import css from './ReorderForm.css';

const ReorderForm = ({
  onClose,
  onSubmit,
  pristine,
  submitting,
}) => {
  const { values } = useFormState();
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

  const getDraggableDivProps = (draggable) => {
    return ({
      className: classnames(
        css.draggableBox,
        draggable.draggableProvided.draggableProps.style,
        { [css.pickedUp]: draggable.draggableSnapshot.isDragging }
      )
    });
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
          component={DragAndDropFieldArray}
          draggableDivStyle={getDraggableDivProps}
          name="widgets"
        >
          {(name) => {
            return (
              <Icon
                icon="drag-drop"
              >
                {get(values, `${name}.name`)}
              </Icon>
            );
          }}
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


