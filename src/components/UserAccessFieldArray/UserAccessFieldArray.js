
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { AppIcon, useStripes } from '@folio/stripes/core';
import {
  Button,
  ConfirmationModal,
  Icon,
  IconButton,
  Layout,
  List,
  MessageBanner,
  Modal,
  ModalFooter,
  MultiColumnList,
  Pane,
  PaneFooter,
  Select,
  TextLink,
  Tooltip
} from '@folio/stripes/components';

import { NewBox } from '@folio/stripes-erm-components';

import css from './UserAccessFieldArray.css';
import UserLookupButton from '../UserLookup/UserLookupButton';
import { useDashboardAccess } from '../hooks';
import { DashboardAccessInfo } from '../Dashboard';
import IfHasAccess from '../IfHasAccess';

const UserAccessFieldArray = ({
  dashboard: {
    id: dashId,
    name: dashName,
  },
  fields: {
    name: fieldsName,
    sortByName,
    value: fieldsValue,
  },
  onClose,
  onSubmit,
  pristine,
  submitting
}) => {
  // Sort by name on mount
  useEffect(() => {
    sortByName();
  }, [sortByName]);

  const { user: { user: { id: userId } = {} } = {} } = useStripes();

  // Set this state on clicking "save and close", and use the length of the array to render confirmation modal
  const [removedUsers, setRemovedUsers] = useState([]);
  // Set this state to be a single name string.
  const [duplicateUser, setDuplicateUser] = useState();

  const {
    items,
    onAddField,
    onUpdateField,
    onDeleteField
  } = useKiwtFieldArray(fieldsName, true);

  const intl = useIntl();
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  const visibleColumns = ['user', 'status', 'email', 'accessLevel'];
  if (hasAccess('manage') || hasAdminPerm) {
    visibleColumns.push('remove');
  }

  const renderUserName = item => (
    `${item.user.personal?.lastName}, ${item.user.personal?.firstName}`
  );

  const renderMessageBanners = () => {
    return items.map(item => {
      if (!item.user?.id) {
        return (
          <MessageBanner
            key={`user-access-field-array-missing-user-banner-${item.user}`}
            dismissible
            type="error"
          >
            <FormattedMessage id="ui-dashboard.dashboardUsers.errorMissing" values={{ user: item.user }} />
          </MessageBanner>
        );
      }

      if (!item.user.active) {
        return (
          <MessageBanner
            key={`user-access-field-array-inactive-user-banner-${item.user.id}`}
            dismissible
            type="warning"
          >
            <FormattedMessage id="ui-dashboard.dashboardUsers.warningInactive" values={{ user: renderUserName(item) }} />
          </MessageBanner>
        );
      }

      return null;
    });
  };

  return (
    <>
      <Pane
        key="user-access-field-array-pane"
        appIcon={<AppIcon app="dashboard" />}
        centerContent
        defaultWidth="100%"
        dismissible
        footer={
          <IfHasAccess
            access="manage"
            dashId={dashId}
          >
            <PaneFooter
              renderEnd={(
                <Button
                  buttonStyle="primary mega"
                  disabled={pristine || submitting}
                  id="clickable-update-dashboard-users"
                  marginBottom0
                  onClick={() => {
                    const fieldRemovedUsers = (fieldsValue?.filter(item => item?._delete === true) ?? []).map(item => renderUserName(item));
                    if (fieldRemovedUsers?.length) {
                      setRemovedUsers(fieldRemovedUsers);
                    } else {
                      onSubmit();
                    }
                  }}
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
          </IfHasAccess>
        }
        height="93vh"
        id="pane-user-access-form"
        onClose={onClose}
        paneTitle={
          <FormattedMessage id="ui-dashboard.dashboardUsers.userAccess" values={{ dashboardName: dashName }} />
        }
      >
        {renderMessageBanners()}
        <DashboardAccessInfo
          key="user-access-field-array-dashboard-access-info"
          dashId={dashId}
        />
        {(hasAccess('manage') || hasAdminPerm) &&
          <Layout
            key="user-access-field-array-lookup-user"
            className="display-flex flex-direction-column flex-align-items-end"
          >
            <UserLookupButton
              onResourceSelected={(resource) => {
                // Allow the adding back of deleted access objects, in order to keep ids in check
                const isDeletedValue = val => val._delete === true && val.user?.id === resource.id;
                const deletedResource = fieldsValue?.find(isDeletedValue);
                const deletedResourceIndex = fieldsValue?.findIndex(isDeletedValue);

                if (deletedResource) {
                  // We're attempting to add back deleted resource;
                  const addBackField = {
                    ...deletedResource,
                    _delete: false
                  };

                  onUpdateField(deletedResourceIndex, addBackField);
                  // Check first the added back user is not a duplicate
                } else if (items?.some(item => item.user.id === resource.id)) {
                  setDuplicateUser(renderUserName({ user: resource }));
                } else {
                  onAddField({
                    access: 'view',
                    user: resource
                  });
                }
              }}
              renderButton={(buttonProps) => (
                <Button
                  {...buttonProps}
                >
                  <FormattedMessage id="ui-dashboard.dashboardUsers.addUser" />
                </Button>
              )}
            />
          </Layout>
        }
        <MultiColumnList
          columnMapping={{
            user: <FormattedMessage id="ui-dashboard.dashboardUsers.user" />,
            status: <FormattedMessage id="ui-dashboard.dashboardUsers.status" />,
            email: <FormattedMessage id="ui-dashboard.dashboardUsers.email" />,
            accessLevel: <FormattedMessage id="ui-dashboard.dashboardUsers.accessLevel" />,
            remove: <FormattedMessage id="ui-dashboard.dashboardUsers.remove" />,
          }}
          columnWidths={{
            user: { min: 200, max: 400 },
            status: { min: 100, max: 200 },
            email: { min: 200, max: 400 },
            accessLevel: { min: 150, max: 300 },
            remove: { min: 50, max: 100 },
          }}
          contentData={
            items.map((item, index) => ({ ...item, index, onRemove: () => onDeleteField(index, item) }))
          }
          formatter={{
            user: item => {
              if (item.user?.id) {
                return (
                  <>
                    <AppIcon
                      app="users"
                      className={item.user.active ? undefined : css.inactiveAppIcon}
                      iconAlignment="baseline"
                      size="small"
                    >
                      <TextLink to={`/users/preview/${item.user.id}`}>{renderUserName(item)}</TextLink>
                    </AppIcon>
                    {
                      !item.id &&
                      <NewBox />
                    }
                  </>
                );
              }

              return item.user;
            },
            status: item => {
              if (!item.user?.id) {
                return (
                  <div className={css.error}>
                    <Icon icon="exclamation-circle">
                      <FormattedMessage id="ui-dashboard.dashboardUsers.status.error" />
                    </Icon>
                  </div>
                );
              }

              if (!item.user.active) {
                return (
                  <div className={css.warn}>
                    <Icon icon="exclamation-circle">
                      <FormattedMessage id="ui-dashboard.dashboardUsers.status.inactive" />
                    </Icon>
                  </div>
                );
              }

              return <FormattedMessage id="ui-dashboard.dashboardUsers.status.active" />;
            },
            email: item => {
              if (item.user?.id) {
                return item.user.personal?.email;
              }
              return '';
            },
            accessLevel: item => {
              // POC field in place of value
              // Allow an admin to edit their own perm ONLY on create (Still don't allow delete)
              if (
                // EITHER
                // User is not the current user AND has admin perm or manage access
                ((hasAccess('manage') || hasAdminPerm) && item?.user?.id !== userId) ||
                // OR
                // User IS current user, but user has adminPerm and the access object didn't previously exist
                (item?.user?.id === userId && hasAdminPerm && !item.id)
              ) {
                return (
                  <Field
                    component={Select}
                    dataOptions={[
                      {
                        value: 'view',
                        label: intl.formatMessage({
                          id: 'ui-dashboard.dashboardUsers.accessLevel.view'
                        })
                      },
                      {
                        value: 'edit',
                        label: intl.formatMessage({
                          id: 'ui-dashboard.dashboardUsers.accessLevel.edit'
                        })
                      },
                      {
                        value: 'manage',
                        label: intl.formatMessage({
                          id: 'ui-dashboard.dashboardUsers.accessLevel.manage'
                        })
                      }
                    ]}
                    id={`${item.id}-access-field`}
                    marginBottom0
                    name={`${fieldsName}[${item.index}].access`}
                    parse={v => v}
                  />
                );
              }

              return <FormattedMessage id={`ui-dashboard.dashboardUsers.accessLevel.${item.access}`} />;
            },
            remove: item => {
              if (
                // EITHER
                // User is not the current user AND has admin perm or manage access
                ((hasAccess('manage') || hasAdminPerm) && item?.user?.id !== userId) ||
                // OR
                // User IS current user, but user has adminPerm and the access object didn't previously exist
                (item?.user?.id === userId && hasAdminPerm && !item.id)
              ) {
                return (
                  <Tooltip
                    id={`remove-user-access-${item.id}`}
                    text={<FormattedMessage id="ui-dashboard.dashboardUsers.removeUser" values={{ name: renderUserName(item) }} />}
                  >
                    {({ ref, ariaIds }) => (
                      <IconButton
                        ref={ref}
                        aria-labelledby={ariaIds.text}
                        icon="trash"
                        iconClassName={css.marginBottom0}
                        onClick={item.onRemove}
                      />
                    )}
                  </Tooltip>
                );
              }
              return '';
            }
          }}
          interactive={false}
          visibleColumns={visibleColumns}
        />
      </Pane>
      <ConfirmationModal
        key="user-access-field-array-confirmation-modal"
        confirmLabel={<FormattedMessage id="ui-dashboard.saveAndClose" />}
        heading={<FormattedMessage id="ui-dashboard.dashboardUsers.removeUsers" />}
        message={[
          <FormattedMessage
            key="removed-users-confirmation-modal-0"
            id="ui-dashboard.dashboardUsers.removeUsers.message"
            values={{ name: dashName }}
          />,
          <List
            key="removed-users-confirmation-modal-1"
            itemFormatter={item => (
              <li
                key={`removed-users-list=${item}`}
              >
                <strong>
                  {item}
                </strong>
              </li>
            )}
            items={removedUsers}
            listStyle="bullets"
          />,
          <FormattedMessage
            key="removed-users-confirmation-modal-2"
            id="ui-dashboard.dashboardUsers.removeUsers.finalMessage"
          />,
        ]}
        onCancel={() => setRemovedUsers([])}
        onConfirm={() => {
          onSubmit();
          setRemovedUsers([]);
        }}
        open={removedUsers?.length > 0}
      />
      <Modal
        key="user-access-field-array-warning-modal"
        footer={
          <ModalFooter>
            <Button
              buttonStyle="primary"
              marginBottom0
              onClick={() => setDuplicateUser()}
            >
              <FormattedMessage id="ui-dashboard.okay" />
            </Button>
          </ModalFooter>
        }
        label={
          <Icon
            icon="exclamation-circle"
            iconClassName={css.error}
          >
            <FormattedMessage id="ui-dashboard.dashboardUsers.duplicateUser" />
          </Icon>
        }
        open={!!duplicateUser}
      >
        <FormattedMessage
          id="ui-dashboard.dashboardUsers.duplicateUser.message"
          values={{
            user: duplicateUser,
            name: dashName
          }}
        />
      </Modal>
    </>
  );
};

UserAccessFieldArray.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.object,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

export default UserAccessFieldArray;
