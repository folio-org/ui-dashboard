import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon, Pluggable, useStripes } from '@folio/stripes/core';
import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  Row,
  TextField,
  Tooltip
} from '@folio/stripes/components';
import { renderUserName } from '@folio/stripes-erm-components';

const propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }),
  onResourceSelected: PropTypes.func,
  onTextChange: PropTypes.func.isRequired,
  resource: PropTypes.object,
};

const UserLookup = ({ disabled, id, input: { name, value }, onResourceSelected, onTextChange, resource }) => {
  const stripes = useStripes();

  const triggerButton = useRef(null);
  const renderLinkUserButton = (v, pluggableRenderProps) => {
    triggerButton.current = pluggableRenderProps.buttonRef;
    const buttonProps = {
      'aria-haspopup': 'true',
      'onClick': pluggableRenderProps.onClick,
      'buttonRef': triggerButton,
      'marginBottom0': true,
      'buttonStyle': v ? 'default' : 'primary',
      'id': `${id}-search-button`,
      name
    };

    if (v) {
      return (
        <Tooltip
          id={`${pluggableRenderProps.id}-user-button-tooltip`}
          text={<FormattedMessage id="stripes-erm-components.contacts.replaceUserSpecific" values={{ user: renderUserName(resource) }} />}
          triggerRef={triggerButton}
        >
          {({ ariaIds }) => (
            <Button
              aria-labelledby={ariaIds.text}
              data-test-ic-link-user
              {...buttonProps}
            >
              <FormattedMessage id="stripes-erm-components.contacts.replaceUser" />
            </Button>
          )}
        </Tooltip>
      );
    }
    return (
      <Button
        data-test-ic-link-user
        disabled={disabled}
        {...buttonProps}
      >
        <FormattedMessage id="stripes-erm-components.contacts.linkUser" />
      </Button>
    );
  };

  const renderTextField = () => (
    <TextField
      disabled={disabled}
      id={`${id}-text-field`}
      onChange={onTextChange}
    />
  );

  const renderUser = () => {
    const {
      email,
      phone
    } = resource ?? {};

    return (
      <div data-test-user-card>
        <Row>
          <Col md={5} xs={12}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.name" />}>
              <span data-test-user-name>{renderUserName(resource)}</span>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.phone" />}>
              <span data-test-user-phone>{phone ?? null}</span>
            </KeyValue>
          </Col>
          <Col md={4} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.email" />}>
              <span data-test-user-email>{email ?? null}</span>
            </KeyValue>
          </Col>
        </Row>
      </div>
    );
  };

  const renderEmpty = () => (
    <div data-test-user-empty>
      <Layout className="textCentered">
        <strong>
          <FormattedMessage id="stripes-erm-components.contacts.noUserLinked" />
        </strong>
      </Layout>
      <Layout className="textCentered">
        <FormattedMessage id="stripes-erm-components.contacts.linkUserToStart" />
      </Layout>
    </div>
  );

  const renderPluggableTriggerCard = (pluggableRenderProps) => {
    return (
      <Card
        cardStyle={value ? 'positive' : 'negative'}
        headerEnd={renderLinkUserButton(value, pluggableRenderProps)}
        headerStart={<AppIcon app="users" size="small"><strong><FormattedMessage id="stripes-erm-components.contacts.user" /></strong></AppIcon>}
        id={`${id}-card`}
        roundedBorder
      >
        {value ? renderUser() : renderEmpty()}
      </Card>
    );
  };

  // If user can't view users, jump straight to fallback option
  if (!stripes.hasPerm('ui-users.view')) {
    return renderTextField();
  }

  return (
    <Pluggable
      dataKey="user"
      disableRecordCreation
      renderTrigger={renderPluggableTriggerCard}
      selectUser={onResourceSelected}
      type="find-user"
    >
      {/* Fallback if plugin missing */}
      {renderTextField()}
    </Pluggable>
  );
};

UserLookup.propTypes = propTypes;

export default UserLookup;
