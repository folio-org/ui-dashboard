import PropTypes from 'prop-types';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { Button, IconButton, Layout, MultiColumnList, Pane, PaneFooter, Select, TextLink } from '@folio/stripes/components';
import { AppIcon, useStripes } from '@folio/stripes/core';
import classNames from 'classnames';

import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import css from './UserAccessFieldArray.css';
import UserLookupButton from '../UserLookup/UserLookupButton';
import { useDashboardAccess } from '../hooks';

const UserAccessFieldArray = ({
  dashboard: {
    id: dashId,
    name: dashName,
  },
  fields: {
    name: fieldsName
  },
  onClose,
  onSubmit,
  pristine,
  submitting
}) => {
  const { user: { user: { id: userId } = {} } = {} } = useStripes();

  const {
    items,
    onAddField,
    onDeleteField
  } = useKiwtFieldArray(fieldsName); // Doing this so this could be moved to another field in a form without breaking stuff

  const intl = useIntl();
  const { hasAccess } = useDashboardAccess(dashId);

  const visibleColumns = ['user', 'status', 'email', 'accessLevel']
  if (hasAccess('manage')) {
    visibleColumns.push('remove');
  }

  return (
    <Pane
      appIcon={<AppIcon app="dashboard" />}
      centerContent
      defaultWidth="100%"
      dismissible
      footer={
        hasAccess('manage') &&
        <PaneFooter
          renderEnd={(
            <Button
              buttonStyle="primary mega"
              disabled={pristine || submitting}
              id="clickable-update-dashboard-users"
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
      }
      height="93vh"
      id="pane-user-access-form"
      onClose={onClose}
      paneTitle={
        <FormattedMessage id="ui-dashboard.dashboardUsers.userAccess" values={{ dashboardName: dashName }} />
      }
    >
      {hasAccess('manage') &&
        <Layout
          className="display-flex flex-direction-column flex-align-items-end"
        >
          <UserLookupButton
            onResourceSelected={(resource) => {
              onAddField({
                access: 'view',
                user: resource
              });
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
              // TODO Icon and link to user
              return (
                <AppIcon
                  app="users"
                  className={item.user.active ? undefined : css.inactiveAppIcon}
                  iconAlignment="baseline"
                  size="small"
                >
                  <TextLink to={`/users/preview/${item.user.id}`}>{`${item.user.personal?.lastName}, ${item.user.personal?.firstName}`}</TextLink>
                </AppIcon>
              );
            }

            return item.user;
          },
          status: item => {
            // TODO colouring these with Icons
            if (!item.user?.id) {
              return <FormattedMessage id="ui-dashboard.dashboardUsers.status.error" />;
            }

            if (!item.user.active) {
              return <FormattedMessage id="ui-dashboard.dashboardUsers.status.inactive" />;
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
            if (hasAccess('manage') && item?.user?.id !== userId) {
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
                  fullWidth
                  marginBottom0
                  name={`${fieldsName}[${item.index}].access`}
                  parse={v => v}
                />
              );
            }

            return <FormattedMessage id={`ui-dashboard.dashboardUsers.accessLevel.${item.access}`} />;
          },
          remove: item => {
            if (hasAccess('manage') && item?.user?.id !== userId) {
              return (
                <IconButton
                  icon="trash"
                  marginBottom0
                  onClick={item.onRemove}
                />
              );
            }
            return '';
          }
        }}
        getCellClass={(defaultClass) => `${defaultClass} ${css.mclCellStyle}`}
        getRowContainerClass={(defaultClass) => `${defaultClass} ${css.mclRowContainer}`}
        headerRowClass={css.editListHeaders}
        interactive={false}
        rowFormatter={({
          cells,
          rowClass,
          rowIndex,
        }) => (
          <div
            aria-rowindex={rowIndex + 2}
            className={classNames(
              css.editListRow,
              css.baselineListRow,
              { [css.isOdd]: !(rowIndex % 2) },
              rowClass
            )}
          >
            {cells}
          </div>
        )}
        visibleColumns={visibleColumns}
      />
    </Pane>
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
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired
};

export default UserAccessFieldArray;
