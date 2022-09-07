import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextArea,
  TextField
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { Field } from 'react-final-form';

import { requiredValidator as required } from '@folio/stripes-erm-components';

const DashboardForm = ({
  handlers: {
    onClose,
    onSubmit
  },
  pristine,
  submitting,
  values
}) => {
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

  return (
    <Paneset>
      <Pane
        appIcon={<AppIcon app="dashboard" />}
        centerContent
        defaultWidth="100%"
        dismissible
        footer={renderPaneFooter()}
        id="pane-dashboard-form"
        onClose={onClose}
        paneTitle={
          values?.id ?
            <FormattedMessage id="ui-dashboard.editDashboard" /> :
            <FormattedMessage id="ui-dashboard.newDashboard" />
        }
      >
        <Row>
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-dashboard.dashboard.name" />}
              name="name"
              required
              validate={required}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-dashboard.dashboard.description" />}
              name="description"
            />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  );
};

DashboardForm.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }),
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.shape({
    id: PropTypes.string
  })
};

export default DashboardForm;
