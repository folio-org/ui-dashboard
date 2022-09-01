import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { MessageBanner } from '@folio/stripes/components';

import { useDashboardAccess } from '../hooks';

const DashboardAccessInfo = ({ dashId }) => {
  const { access, hasAccess, hasAdminPerm } = useDashboardAccess(dashId);
  console.log("ACCESS: %o", access);
  console.log("HASACCESS: %o", hasAccess('view'));
  console.log("HASADMINPERM: %o", hasAdminPerm);

  if (!hasAccess('view') && hasAdminPerm) {
    return (
      <MessageBanner
        type="error"
      >
        <FormattedMessage id="ui-dashboard.dashboardUsers.accessWarning" />
      </MessageBanner>
    );
  }

  return null;
};

DashboardAccessInfo.propTypes = {
  dashId: PropTypes.string.isRequired
};

export default DashboardAccessInfo;
