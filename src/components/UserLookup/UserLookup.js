import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  NoValue,
  Row,
  Tooltip
} from '@folio/stripes/components';

import { AppIcon, Pluggable } from '@folio/stripes/core';

import { renderUserName } from '@folio/stripes-erm-components';

// This must return a function to render a link button
const propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  input: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  }),
  onResourceSelected: PropTypes.func,
  resource: PropTypes.object
};

const UserLookupComponent = ({ disabled, id, input: { name, value }, onResourceSelected, resource }) => {
  let triggerButton = useRef(null);

  const renderLinkUserButton = v => (
    <Pluggable
      dataKey="user"
      disableRecordCreation
      renderTrigger={(pluggableRenderProps) => {
        triggerButton = pluggableRenderProps.buttonRef;

        const buttonProps = {
          'aria-haspopup': 'true',
          'buttonStyle': v ? 'default' : 'primary',
          'id': `${id}-search-button`,
          'name': name,
          'onClick': pluggableRenderProps.onClick,
          'buttonRef': triggerButton,
          'marginBottom0': true
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
      }}
      selectUser={onResourceSelected}
      type="find-user"
    >
      <FormattedMessage id="stripes-erm-components.contacts.noUserPlugin" />
    </Pluggable>
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
              <span data-test-user-name>
                {renderUserName(resource)}
              </span>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.phone" />}>
              <span data-test-user-phone>
                {phone ?? <NoValue />}
              </span>
            </KeyValue>
          </Col>
          <Col md={4} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.email" />}>
              <span data-test-user-email>
                {email ?? <NoValue />}
              </span>
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

  return (
    <Card
      cardStyle={value ? 'positive' : 'negative'}
      headerEnd={renderLinkUserButton(value)}
      headerStart={(
        <AppIcon app="users" size="small">
          <strong>
            <FormattedMessage id="stripes-erm-components.contacts.user" />
          </strong>
        </AppIcon>
        )}
      id={id}
      roundedBorder
    >
      {value ? renderUser() : renderEmpty()}
    </Card>
  );
};

UserLookupComponent.propTypes = propTypes;

export default UserLookupComponent;
