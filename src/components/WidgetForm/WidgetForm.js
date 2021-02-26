import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Field, useFormState, useForm } from 'react-final-form';

import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

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
import SimpleSearchForm from './SimpleSearch/SimpleSearchForm';

const propTypes = {
  data: PropTypes.shape({
    widgetDefinitions: PropTypes.array
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

// This component should contain the logic to select a widget definition and push on to a specific widgetForm, ie SimpleSearchForm
const WidgetForm = ({
  data: {
    widgetDefinitions = []
  } = {},
  handlers:{
    onClose,
    onSubmit
  },
  pristine,
  submitting,
}) => {
  /*
   * Create a callback and trigger variable we can pass through to other forms.
   * These will be used to clear the relevant sub-forms when definition changes.
  */
  const [defChanged, setDefChanged] = useState(false);
  const toggleDefChange = () => setDefChanged(!defChanged);

  // Simple true/false to show/hide modal and then wipe form
  const [confirmWipeFormModalOpen, setConfirmWipeFormModalOpen] = useState(false);
  const [newDef, setNewDef] = useState();

  const ky = useOkapiKy();
  const { dirtyFields, values } = useFormState();
  const { change } = useForm();

  // Selected widget definition will be just an id, so fetch full definition again here
  const { data: specificWidgetDefinition } = useQuery(
    // Ensure we get a fresh fetch per CREATE/EDIT with values.definition?.id
    ['ui-dashboard', 'widgetCreateRoute', 'getSpecificWidgetDef', values.definition?.id],
    () => ky(`servint/widgets/definitions/${values.definition?.id}`).json(),
    {
      /* Only run this query if the user has selected a widgetDefinition */
      enabled: !!values.definition?.id
    }
  );

  // This may be (probably will be) versioned in future, keep an eye out for that
  const getWidgetFormComponent = (widgetDef) => {
    switch (widgetDef?.type?.name) {
      case 'SimpleSearch':
        return (
          <SimpleSearchForm
            defChanged={defChanged}
            specificWidgetDefinition={specificWidgetDefinition}
            toggleDefChange={toggleDefChange}
          />
        );
      default:
        // TODO add real error here
        return `No widget form component for type: ${widgetDef?.type?.name}`;
    }
  };

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
     * Read proposed definition change from state
     * Update trigger mechanism for dynamic sub-forms
     * Change field value
     * Remove from state
     */
    toggleDefChange();
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
                />
              </KeyValue>
            </Col>
          </Row>
          {specificWidgetDefinition &&
            // Get specific form component for the selected widgetDefinition
            getWidgetFormComponent(specificWidgetDefinition)
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
