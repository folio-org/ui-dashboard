import { MultiColumnList, Pane, Select, TextField } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import classNames from 'classnames';

import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import { Field, useFormState } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import css from './UserAccessFieldArray.css';

const UserAccessFieldArray = ({
  data: {
    access: myAccess,
    dashboard,
    users
  } = {},
  fields,
  handlers: {
    hasAccess,
    onClose,
    onSubmit
  } = {}
}) => {
  const { values } = useFormState();
  console.log("VALS: %o", values);
  console.log("FIELDS: %o", fields);

  const intl = useIntl();

  return (
    <Pane
      appIcon={<AppIcon app="dashboard" />}
      centerContent
      defaultWidth="100%"
      dismissible
      id="pane-user-access-form"
      onClose={onClose}
      paneTitle={
        <FormattedMessage id="ui-dashboard.dashboardUsers.userAccess" values={{ dashboardName: dashboard.name }} />
      }
    >
      <MultiColumnList
        columnMapping={{
          user: <FormattedMessage id="ui-dashboard.dashboardUsers.user" />,
          status: <FormattedMessage id="ui-dashboard.dashboardUsers.status" />,
          email: <FormattedMessage id="ui-dashboard.dashboardUsers.email" />,
          accessLevel: <FormattedMessage id="ui-dashboard.dashboardUsers.accessLevel" />,
        }}
        columnWidths={{
          user: { min: 200, max: 300 },
          status: { min: 100, max: 150 },
          email: { min: 200, max: 300 },
          accessLevel: { min: 100, max: 150 },
        }}
        contentData={
          // Assign fieldName/fieldIndex to contentData so we can use it in fields
          fields.map((fieldName, fieldIndex) => {
          // Fetch the content from the field Values
            const cd = cloneDeep(get(values, fieldName));
            return { ...cd, fieldName, fieldIndex };
          })
        }
        formatter={{
          user: item => {
            if (item.user?.id) {
              // TODO Icon and link to user
              return `${item.user.personal?.lastName}, ${item.user.personal?.firstName}`;
            }
            return item.userId;
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
            // FIXME Make this reliant on accessLevel
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
                name={`${item.fieldName}.access`}
                parse={v => v}
              />
            );

            return <FormattedMessage id={`ui-dashboard.dashboardUsers.accessLevel.${item.access}`} />;
          },
        }}
        getCellClass={(defaultClass) => `${defaultClass} ${css.mclCellStyle}`}
        getRowContainerClass={(defaultClass) => `${defaultClass} ${css.mclRowContainer}`}
        headerRowClass={css.editListHeaders}
        interactive={false}
        // TODO RowFormatter needs to deal with fields too
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
        visibleColumns={['user', 'status', 'email', 'accessLevel']}
      />
    </Pane>
  );
};

export default UserAccessFieldArray;
