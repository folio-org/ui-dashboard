import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { MessageBanner } from '@folio/stripes/components';

import { useDashboardAccess } from '../../hooks';

const DashboardAccessInfo = ({ dashId }) => {
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  if (!hasAccess('view') && hasAdminPerm) {
    return (
      <MessageBanner
        type="warning"
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
