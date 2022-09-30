import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Field, useFormState } from 'react-final-form';

import { AppIcon } from '@folio/stripes/core';

import {
  Button,
  Col,
  HasCommand,
  InfoPopover,
  Pane,
  PaneFooter,
  Paneset,
  Row,
  TextArea,
  TextField,
  checkScope,
} from '@folio/stripes/components';

import { composeValidators as compose, requiredValidator as required } from '@folio/stripes-erm-components';

import DashboardMultipleUserInfo from '../DashboardMultipleUserInfo';

// Constant for linting
const MAX_DASHBOARD_NAME_LENGTH = 25;
const maxLength = (value) => {
  if (value?.length > MAX_DASHBOARD_NAME_LENGTH) {
    return <FormattedMessage id="ui-dashboard.dashboard.name.tooLong" />;
  }

  return null;
};

const DashboardForm = ({
  dashboardUsers = [],
  handlers: {
    onClose,
    onSubmit
  },
  pristine,
  submitting
}) => {
  const { values } = useFormState();

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

  const shortcuts = [
    {
      name: 'save',
      handler: (e) => {
        e.preventDefault();
        if (!pristine && !submitting) {
          onSubmit();
        }
      }
    }
  ];

  return (
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
          id="pane-dashboard-form"
          onClose={onClose}
          paneTitle={
            values?.id ?
              <FormattedMessage id="ui-dashboard.editDashboard" /> :
              <FormattedMessage id="ui-dashboard.newDashboard" />
          }
        >
          <DashboardMultipleUserInfo dashboardUsers={dashboardUsers} />
          <Row>
            <Col xs={3}>
              <Field
                component={TextField}
                label={
                  <>
                    <FormattedMessage id="ui-dashboard.dashboard.name" />
                    <InfoPopover
                      content={<FormattedMessage id="ui-dashboard.dashboard.name.info" />}
                    />
                  </>
                }
                maxLength={25}
                name="name"
                required
                validate={compose(
                  required,
                  maxLength
                )}
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
    </HasCommand>
  );
};

DashboardForm.propTypes = {
  dashboardUsers: PropTypes.arrayOf(PropTypes.object),
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
