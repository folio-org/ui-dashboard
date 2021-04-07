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

import useWidgetDefinition from '../useWidgetDefinition';

const propTypes = {
  data: PropTypes.shape({
    defId: PropTypes.string,
    specificWidgetDefinition: PropTypes.object,
    widgetDefinitions: PropTypes.array
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setDefId: PropTypes.func.isRequired
  }),
  params: PropTypes.shape({
    widgetId: PropTypes.string,
  }).isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

// This component should contain the logic to select a widget definition and push on to a specific widgetForm, ie SimpleSearchForm
const WidgetForm = ({
  data: {
    defId,
    params,
    widgetDefinitions = []
  } = {},
  handlers:{
    onClose,
    onSubmit,
    setDefId
  },
  pristine,
  submitting,
}) => {
  const { dirtyFields, values } = useFormState();
  const { change } = useForm();

  /*
   * Keep the defId up to date, this allows us to keep track of the definition beyond the id
  */
  useEffect(() => {
    const currentDefId = get(values, 'definition.id');
    if (currentDefId !== defId) {
      // Definition has changed at this point
      setDefId(currentDefId);
    }
  }, [defId, setDefId, values]);

  // Simple true/false to show/hide modal and then wipe form
  const [confirmWipeFormModalOpen, setConfirmWipeFormModalOpen] = useState(false);
  const [newDef, setNewDef] = useState();

  const {
    specificWidgetDefinition,
    componentBundle: { WidgetFormComponent }
  } = useWidgetDefinition(defId);

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

  const changeDefintionAndWipeForm = () => {
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

    change('definition.id', newDef);
    setNewDef();
  };

  const selectifiedWidgetDefs = [
    { value: '', label: '' },
    ...widgetDefinitions.map(wd => ({ value: wd.id, label: wd.name }))
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
                  name="definition.id"
                  onChange={e => {
                    // Other than the name/def, are any of the fields dirty?
                    delete dirtyFields.name;
                    delete dirtyFields['definition.id'];
                    const dirtyFieldsCount = Object.keys(dirtyFields)?.length;

                    // If we have dirty fields, set up confirmation modal
                    if (dirtyFieldsCount > 0) {
                      setNewDef(e.target.value);
                      setConfirmWipeFormModalOpen(!confirmWipeFormModalOpen);
                    } else {
                      change('definition.id', e.target.value);
                    }
                  }}
                  required
                  validate={requiredValidator}
                />
              </KeyValue>
            </Col>
          </Row>
          {specificWidgetDefinition &&
            // Get specific form component for the selected widgetDefinition
            <WidgetFormComponent
              specificWidgetDefinition={specificWidgetDefinition}
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
          changeDefintionAndWipeForm();
          setConfirmWipeFormModalOpen(!confirmWipeFormModalOpen);
        }}
        open={confirmWipeFormModalOpen}
      />
    </>
  );
};

WidgetForm.propTypes = propTypes;
export default WidgetForm;
