import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useParams } from 'react-router-dom';

import {
  Button,
  Headline,
  Icon,
  Layout,
} from '@folio/stripes/components';
import { ResponsiveButtonGroup } from '@k-int/stripes-kint-components';

import ActionMenu from '../../ActionMenu';
import css from './Header.css';
import { useDashboardAccess } from '../../hooks';

// This component will render the tab group for dashboards,
// as well as the joint "dashboard" and "dashboards" actions
const Header = ({
  dashboard: {
    id: dashId,
    name: dashName
  },
  dashboards,
  onCreateDashboard, // All dashboards
  onCreateWidget, // dashboard
  onDeleteDashboard, // dashboard
  onEdit, // dashboard
  onManageDashboards, // All dashboards
  onReorder, // dashboard
  onUserAccess // dashboard
}) => {
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);
  const { dashId: currentDashboardId } = useParams();

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
          <Icon
            icon="plus-sign"
          >
            <FormattedMessage id="ui-dashboard.newWidget" />
          </Icon>
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
          <Icon
            icon="gear"
          >
            <FormattedMessage id="ui-dashboard.manageWidgets" />
          </Icon>
        </Button>
      );

      dashboardActions.push(
        <Button
          key="clickable-editdashboard"
          buttonStyle="dropdownItem"
          disabled={!onEdit}
          id="clickable-editdashboard"
          onClick={onEdit}
        >
          <Icon
            icon="edit"
          >
            <FormattedMessage id="ui-dashboard.editDashboard" />
          </Icon>
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
        <Icon
          icon="profile"
        >
          {(hasAccess('manage') || hasAdminPerm) ?
            <FormattedMessage id="ui-dashboard.manageUserAccess" /> :
            <FormattedMessage id="ui-dashboard.viewUserAccess" />
          }
        </Icon>
      </Button>
    );

    if (hasAccess('manage') || hasAdminPerm) {
      dashboardActions.push(
        <Button
          key="clickable-delete-dashboard"
          buttonStyle="dropdownItem"
          id="clickable-delete-dashboard"
          onClick={onDeleteDashboard}
        >
          <Icon
            icon="trash"
          >
            <FormattedMessage id="ui-dashboard.deleteDashboard" />
          </Icon>
        </Button>
      );
    }

    allDashboardActions.push(
      <Button
        key="clickable-new-dashboard"
        buttonStyle="dropdownItem"
        disabled={!onCreateDashboard}
        id="clickable-new-dashboard"
        onClick={onCreateDashboard}
      >
        <Icon
          icon="plus-sign"
        >
          <FormattedMessage id="ui-dashboard.newDashboard" />
        </Icon>
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
        <Icon
          icon="gear"
        >
          <FormattedMessage id="ui-dashboard.manageDashboards" />
        </Icon>
      </Button>
    );

    return (
      <>
        <Headline faded margin="none" size="small">
          {dashName}
        </Headline>
        {dashboardActions}
        <Layout className="marginTop1" />
        <Headline faded margin="none" size="small">
          <FormattedMessage id="ui-dashboard.allDashboards" />
        </Headline>
        {allDashboardActions}
      </>
    );
  };

  const renderHeaderCentre = () => {
    // it's not the best solution, there should a better way to do this on buttonId
    const idOrder = dashboards?.map(dshb => dshb.dashboard?.id);
    const selectedIndex = idOrder.indexOf(currentDashboardId);
    if (dashboards?.length === 1) {
      return (
        <Headline>
          {dashName}
        </Headline>
      );
    }

    if (dashboards?.length > 1) {
      return (
        <div className={css.buttonContainer}>
          <ResponsiveButtonGroup
            marginBottom0
            selectedIndex={selectedIndex}
          >
            {dashboards?.map(dba => (
              <Button
                key={`clickable-tab-to-dashboard-${dba.dashboard?.id}`}
                marginBottom0
                to={`/dashboard/${dba.dashboard?.id}`}
              >
                {dba.dashboard?.name}
              </Button>
            ))}
          </ResponsiveButtonGroup>
        </div>
      );
    }

    return (<div />);
  };

  return (
    <div className={css.header}>
      <div /> {/* Empty start item so we can get centre/end aligned */}
      {renderHeaderCentre()}
      <ActionMenu actionMenu={getActionMenu} />
    </div>
  );
};

Header.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  dashboards: PropTypes.arrayOf(PropTypes.shape({
    dashboard: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  onCreateDashboard: PropTypes.func.isRequired,
  onCreateWidget: PropTypes.func.isRequired,
  onDeleteDashboard: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onManageDashboards: PropTypes.func,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func
};

export default Header;
