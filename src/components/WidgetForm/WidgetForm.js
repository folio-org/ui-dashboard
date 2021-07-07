import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Field, useFormState, useForm } from 'react-final-form';

import {
  AppIcon
} from '@folio/stripes/core';

import {
  Button,
  ConfirmationModal,
  Col,
  HasCommand,
  KeyValue,
  Pane,
  Paneset,
  PaneFooter,
  Row,
  Select,
  TextField,
  checkScope,
} from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';

const propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    params: PropTypes.shape({
      widgetId: PropTypes.string,
    }),
    specificWidgetDefinition: PropTypes.object,
    widgetDefinitions: PropTypes.array
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setSelectedDef: PropTypes.func.isRequired
  }),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

// This component should contain the logic to select a widget definition and push on to a specific widgetForm, ie SimpleSearchForm
const WidgetForm = ({
  data: {
    name,
    params,
    selectedDefinition,
    widgetDefinitions = [],
    WidgetFormComponent
  } = {},
  handlers:{
    onClose,
    onSubmit,
    setSelectedDef
  },
  pristine,
  submitting,
}) => {
  const { dirtyFields, values } = useFormState();
  const { change } = useForm();

  // Simple true/false to show/hide modal and then wipe form
  const [confirmWipeFormModalOpen, setConfirmWipeFormModalOpen] = useState(false);
  // Need to keep track of "next" widgetDef index for use in the modal.
  // Can reset to null on cancel or use for select after wiping form.
  const [newDef, setNewDef] = useState();

  const shortcuts = [
    {
      name: 'save',
      handler: (e) => {
        e.preventDefault();
        if (!pristine && !submitting) {
          onSubmit();
        }
      }
    },
  ];

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-create-widget"
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

  const changeDefinitionAndWipeForm = () => {
    /*
     * This should control wiping the form when def changes,
     * so it runs through all fields that aren't name or definition and wipes them
    */
    const fieldsToNotWipe = ['definition', 'name'];
    Object.keys(values).forEach(valueKey => {
      if (!fieldsToNotWipe.includes(valueKey)) {
        change(valueKey, undefined);
      }
    });

    change('definition', newDef);
    setSelectedDef(widgetDefinitions[newDef]);
    setNewDef();
  };

  const selectifiedWidgetDefs = [
    { value: '', label: '' },
    ...widgetDefinitions.map((wd, index) => ({ value: index, label: wd.name }))
  ];

  return (
    <>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            appIcon={<AppIcon app="dashboard" />}
            centerContent
            defaultWidth="100%"
            dismissible
            footer={renderPaneFooter()}
            id="pane-widget-form"
            onClose={onClose}
            paneTitle={
              params.widgetId ?
                <FormattedMessage id="ui-dashboard.widgetForm.editWidget" values={{ widgetname: name }} /> :
                <FormattedMessage id="ui-dashboard.widgetForm.createWidget" />
            }
          >
            <Row>
              <Col xs={6}>
                <KeyValue
                  data-testid="widget-form-name"
                  label={<FormattedMessage id="ui-dashboard.widgetForm.widgetName" />}
                >
                  <Field
                    component={TextField}
                    maxLength={255}
                    name="name"
                    required
                    validate={requiredValidator}
                  />
                </KeyValue>
              </Col>
              <Col xs={6}>
                <KeyValue
                  data-testid="widget-form-definition"
                  label={<FormattedMessage id="ui-dashboard.widgetForm.widgetDefinition" />}
                >
                  <Field
                    component={Select}
                    dataOptions={selectifiedWidgetDefs}
                    disabled={!!params.widgetId}
                    name="definition"
                    onChange={e => {
                    // Other than the name/def, are any of the fields dirty?
                    delete dirtyFields.name;
                    delete dirtyFields.definition;
                    const dirtyFieldsCount = Object.keys(dirtyFields)?.length;

                    // If we have dirty fields, set up confirmation modal
                    if (dirtyFieldsCount > 0) {
                      setNewDef(e.target.value);
                      setConfirmWipeFormModalOpen(!confirmWipeFormModalOpen);
                    } else {
                      change('definition', e.target.value);
                      setSelectedDef(widgetDefinitions[e.target.value]);
                    }
                  }}
                    required
                    validate={requiredValidator}
                  />
                </KeyValue>
              </Col>
            </Row>
            {selectedDefinition &&
            // Get specific form component for the selected widgetDefinition
            <WidgetFormComponent
              isEdit={!!params.widgetId}
              specificWidgetDefinition={selectedDefinition}
            />
          }
          </Pane>
        </Paneset>
        <ConfirmationModal
          buttonStyle="danger"
          confirmLabel={<FormattedMessage id="ui-dashboard.widgetForm.changeDefinitionWarningModal.continue" />}
          data-test-delete-confirmation-modal
          heading={<FormattedMessage id="ui-dashboard.widgetForm.changeDefinitionWarningModal.heading" />}
          id="wipe-widget-form-confirmation"
          message={<FormattedMessage id="ui-dashboard.widgetForm.changeDefinitionWarningModal.message" />}
          onCancel={() => {
          setConfirmWipeFormModalOpen(!confirmWipeFormModalOpen);
          setNewDef();
        }}
          onConfirm={() => {
          changeDefinitionAndWipeForm();
          setConfirmWipeFormModalOpen(!confirmWipeFormModalOpen);
        }}
          open={confirmWipeFormModalOpen}
        />
      </HasCommand>
    </>
  );
};

WidgetForm.propTypes = propTypes;
export default WidgetForm;
