import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { FieldArray } from "react-final-form-arrays";
import { Field, useFormState, useForm } from 'react-final-form';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {
  Button,
  Col,
  KeyValue,
  Pane,
  Paneset,
  PaneFooter,
  Row
} from '@folio/stripes/components';

import css from './ReorderForm.css';

const ReorderForm = ({
  dashboard,
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
          change(`widgets[${index}].weight`, index)
        }
      });
    }
  }, [values, change])
  
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
        defaultWidth="100%"
        footer={renderPaneFooter()}
        id="pane-reorder-form"
        paneTitle={"THIS IS A TEST, CHANGE LATER"}
      >
        <FieldArray name="widgets">
          {({ fields }) => (
            <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                  >
                  {fields.map((name, index) => (
                    <Draggable
                      key={name}
                      draggableId={name}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={css.draggableBox}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Field name={`${name}.name`}>
                            {({ input: { name, value } }) => (
                              <label name={name}>{value}</label>
                            )}
                          </Field>
                        </div>
                      )}
                      
                    </Draggable>
                  ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </FieldArray>
      </Pane>
    </Paneset>
  );
}

ReorderForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ReorderForm;


