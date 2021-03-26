import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon
} from '@folio/stripes/components';

import css from './DashboardHeader.css';

const propTypes = {
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired
};

export default function DashboardHeader({ onCreate, onReorder }) {
  const actionMenu = () => (
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
        id="clickable-reorderdashboard"
        onClick={onReorder}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.reorder" />
      </Button>
    </>
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenuToggle = ({ onToggle, triggerRef, keyHandler, open, ariaProps, getTriggerProps }) => (
    <Button
      ref={triggerRef}
      buttonClass={css.actionMenuToggle}
      buttonStyle="primary"
      marginBottom0
      onClick={onToggle}
      onKeyDown={keyHandler}
      type="button"
      {...getTriggerProps()}
      {...ariaProps}
    >
      <Icon icon={open ? 'triangle-up' : 'triangle-down'} iconPosition="end">
        <FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />
      </Icon>
    </Button>
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenuContent = ({ onToggle, open, keyHandler }) => (
    <DropdownMenu>
      {actionMenu({ onToggle, open, keyHandler })}
    </DropdownMenu>
  );

  const renderActionMenu = () => (
    <Dropdown
      key="action-menu-toggle"
      hasPadding
      renderMenu={renderActionMenuContent}
      renderTrigger={renderActionMenuToggle}
    />
  );



  return (
    <div className={css.dashboardHeader}>
      {renderActionMenu()}
    </div>
  );
}

DashboardHeader.propTypes = propTypes;
