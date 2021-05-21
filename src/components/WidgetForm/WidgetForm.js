import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { Field, useFormState, useForm } from 'react-final-form';

import {
  Button,
  ConfirmationModal,
  Col,
  KeyValue,
  Pane,
  Paneset,
  PaneFooter,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';

const propTypes = {
  data: PropTypes.shape({
    specificWidgetDefinition: PropTypes.object,
    widgetDefinitions: PropTypes.array
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }),
  params: PropTypes.shape({
    widgetId: PropTypes.string,
  }),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

// This component should contain the logic to select a widget definition and push on to a specific widgetForm, ie SimpleSearchForm
const WidgetForm = ({
  data: {
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
    ...widgetDefinitions.map((wd, index) => ({ value: index, label: `${wd.name} (v${wd.version})` }))
  ];

  return (
    <>
      <Paneset>
        <Pane
          centerContent
          defaultWidth="100%"
          footer={renderPaneFooter()}
          id="pane-widget-form"
          paneTitle={<FormattedMessage id="ui-dashboard.widgetForm.createWidget" />}
        >
          <Row>
            <Col xs={6}>
              <KeyValue
                data-testid="widget-form-name"
                label={<FormattedMessage id="ui-dashboard.widgetForm.widgetName" />}
              >
                <Field
                  component={TextField}
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
    </>
  );
};

WidgetForm.propTypes = propTypes;
export default WidgetForm;
