import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

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

const propTypes = {
  data: PropTypes.shape({
    widgetDefinitions: PropTypes.array
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

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
  // This component should contain the logic to select a widget definition and push on to a specific widgetForm, ie SimpleSearchForm
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
            <Field
              component={Select}
              dataOptions={selectifiedWidgetDefs}
              name="definition.id"
            />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  );
};

WidgetForm.propTypes = propTypes;

export default WidgetForm;
