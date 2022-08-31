import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

import ActionMenu from '../../ActionMenu';
import css from './DashboardHeader.css';

const propTypes = {
  onCreate: PropTypes.func,
  onReorder: PropTypes.func
};

const DashboardHeader = ({ onCreate, onReorder, onUserAccess }) => {
  const getActionMenu = () => (
    <>
      <Button
        buttonStyle="dropdownItem"
        id="clickable-new-widget"
        onClick={onCreate}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.new" />
      </Button>
      <Button
        buttonStyle="dropdownItem"
        disabled={!onReorder}
        id="clickable-reorderdashboard"
        onClick={onReorder}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.reorder" />
      </Button>
      <Button
        buttonStyle="dropdownItem"
        disabled={!onUserAccess}
        id="clickable-userAccess"
        onClick={onUserAccess}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.userAccess" />
      </Button>
    </>
  );

  return (
    <div className={css.dashboardHeader}>
      <ActionMenu actionMenu={getActionMenu} />
    </div>
  );
};

DashboardHeader.propTypes = propTypes;

export default DashboardHeader;
