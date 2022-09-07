import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button, Headline, Layout,
} from '@folio/stripes/components';

import ActionMenu from '../../ActionMenu';
import css from './Header.css';
import { useDashboardAccess } from '../../hooks';

const propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onCreateDashboard: PropTypes.func.isRequired,
  onCreateWidget: PropTypes.func.isRequired,
  onManageDashboards: PropTypes.func,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func
};

// This component will render the tab group for dashboards,
// as well as the joint "dashboard" and "dashboards" actions
const Header = ({
  dashboard: {
    id: dashId,
    name: dashName
  },
  onCreateDashboard, // All dashboards
  onCreateWidget, // dashboard
  onManageDashboards, // All dashboards
  onReorder, // dashboard
  onUserAccess // dashboard
}) => {
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  const getActionMenu = () => {
    const dashboardActions = [];
    const allDashboardActions = [];

    if (hasAccess('edit') || hasAdminPerm) {
      dashboardActions.push(
        <Button
          key="clickable-new-widget"
          buttonStyle="dropdownItem"
          id="clickable-new-widget"
          onClick={onCreateWidget}
        >
          <FormattedMessage id="ui-dashboard.newWidget" />
        </Button>
      );

      dashboardActions.push(
        <Button
          key="clickable-reorderdashboard"
          buttonStyle="dropdownItem"
          disabled={!onReorder}
          id="clickable-reorderdashboard"
          onClick={onReorder}
        >
          <FormattedMessage id="ui-dashboard.reorderWidgets" />
        </Button>
      );
    }
    dashboardActions.push(
      <Button
        key="clickable-userAccess"
        buttonStyle="dropdownItem"
        disabled={!onUserAccess}
        id="clickable-userAccess"
        onClick={onUserAccess}
      >
        <FormattedMessage id="ui-dashboard.userAccess" />
      </Button>
    );

    allDashboardActions.push(
      <Button
        key="clickable-new-dashboard"
        buttonStyle="dropdownItem"
        disabled={!onCreateDashboard}
        id="clickable-new-dashboard"
        onClick={onCreateDashboard}
      >
        <FormattedMessage id="ui-dashboard.newDashboard" />
      </Button>
    );

    allDashboardActions.push(
      <Button
        key="clickable-manage-dashboards"
        buttonStyle="dropdownItem"
        disabled={!onManageDashboards}
        id="clickable-manage-dashboards"
        onClick={onManageDashboards}
      >
        <FormattedMessage id="ui-dashboard.manageDashboards" />
      </Button>
    );

    return (
      <>
        <Headline faded margin="none">
          {dashName}
        </Headline>
        {dashboardActions}
        <Layout className="marginTop1" />
        <Headline faded margin="none">
          <FormattedMessage id="ui-dashboard.allDashboards" />
        </Headline>
        {allDashboardActions}
      </>
    );
  };

  return (
    <div className={css.header}>
      <ActionMenu actionMenu={getActionMenu} />
    </div>
  );
};

Header.propTypes = propTypes;

export default Header;
