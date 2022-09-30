import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { MessageBanner } from '@folio/stripes/components';

const DashboardMultipleUserInfo = ({ dashboardUsers = [] }) => {
  if (dashboardUsers?.length > 1) {
    return (
      <MessageBanner
        type="warning"
      >
        <FormattedMessage id="ui-dashboard.dashboardUsers.multipleUsersWarning" />
      </MessageBanner>
    );
  }

  return null;
};

DashboardMultipleUserInfo.propTypes = {
  dashboardUsers: PropTypes.arrayOf(PropTypes.object)
};

export default DashboardMultipleUserInfo;
