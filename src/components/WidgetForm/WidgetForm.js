import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Field, useFormState } from 'react-final-form';

import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import {
  Button,
  Col,
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
  const ky = useOkapiKy();
  const { values } = useFormState();
  console.log("WF VALUES: %o", values)

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
          <SimpleSearchForm />
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

  const selectifiedWidgetDefs = [
    { value: '', label: '' },
    ...widgetDefinitions.map(wd => ({ value: wd.id, label: wd.name }))
  ];

  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        footer={renderPaneFooter()}
        id="pane-widget-form"
        paneTitle={<FormattedMessage id="ui-dashboard.widgetForm.createWidget" />}
      >
        <Row>
          <Col xs={6}>
            <Field
              component={TextField}
              name="name"
            />
          </Col>
          <Col xs={6}>
            <Field name="definition.id"
              component={Select}
              dataOptions={selectifiedWidgetDefs}
              required
            />
          </Col>
        </Row>
        {specificWidgetDefinition &&
          // Get specific form component for the selected widgetDefinition
          // TODO work out if changing to a definition of same type saves some inputted information
          // If so, does it then get submitted by mistake when field is no longer present?
          getWidgetFormComponent(specificWidgetDefinition)
        }
      </Pane>
    </Paneset>
  );
};

WidgetForm.propTypes = propTypes;
export default WidgetForm;
