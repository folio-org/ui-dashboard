import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

import ActionMenu from '../../ActionMenu';
import css from './DashboardHeader.css';
import { useDashboardAccess } from '../../hooks';

const propTypes = {
  dashId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func
};

const DashboardHeader = ({ dashId, onCreate, onReorder, onUserAccess }) => {
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  const getActionMenu = () => {
    const actionMenuButtons = [];
    if (hasAccess('edit') || hasAdminPerm) {
      actionMenuButtons.push(
        <Button
          key="clickable-new-widget"
          buttonStyle="dropdownItem"
          id="clickable-new-widget"
          onClick={onCreate}
        >
          <FormattedMessage id="ui-dashboard.dashboardHeader.new" />
        </Button>
      );

      actionMenuButtons.push(
        <Button
          key="clickable-reorderdashboard"
          buttonStyle="dropdownItem"
          disabled={!onReorder}
          id="clickable-reorderdashboard"
          onClick={onReorder}
        >
          <FormattedMessage id="ui-dashboard.dashboardHeader.reorder" />
        </Button>
      );
    }
    actionMenuButtons.push(
      <Button
        key="clickable-userAccess"
        buttonStyle="dropdownItem"
        disabled={!onUserAccess}
        id="clickable-userAccess"
        onClick={onUserAccess}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.userAccess" />
      </Button>
    );
    return actionMenuButtons;
  };

  return (
    <div className={css.dashboardHeader}>
      <ActionMenu actionMenu={getActionMenu} />
    </div>
  );
};

DashboardHeader.propTypes = propTypes;

export default DashboardHeader;
