import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Card,
  Col,
  KeyValue,
  Layout,
  Row,
  Tooltip
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import { renderUserName } from '@folio/stripes-erm-components';
import UserLookupButton from './UserLookupButton';

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

const UserLookup = ({ disabled, id, input: { name, value }, onResourceSelected, resource }) => {
  const renderLinkUserButton = v => (

    <UserLookupButton
      buttonProps={{
        'buttonStyle': v ? 'default' : 'primary',
        id: `${id}-search-button`,
        name
      }}
      onResourceSelected={onResourceSelected}
      renderButton={(buttonProps, pluggableRenderProps, triggerButton) => {
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
              <span data-test-user-name>
                {renderUserName(resource)}
              </span>
            </KeyValue>
          </Col>
          <Col md={3} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.phone" />}>
              <span data-test-user-phone>
                {phone ?? null}
              </span>
            </KeyValue>
          </Col>
          <Col md={4} xs={6}>
            <KeyValue label={<FormattedMessage id="stripes-erm-components.contacts.email" />}>
              <span data-test-user-email>
                {email ?? null}
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

UserLookup.propTypes = propTypes;

export default UserLookup;
