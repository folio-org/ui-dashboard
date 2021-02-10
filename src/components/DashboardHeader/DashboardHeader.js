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
  widgetOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string
  }))
};

export default function DashboardHeader({ widgetOptions }) {
  const renderWidgetOption = (widget) => {
    return (
      <Button
        buttonStyle="dropdownItem"
        id={`widget-${widget.name}`}
        marginBottom0
        // TODO remove this alert
        onClick={() => alert(`Create new ${widget.label} widget`)}
      >
        <Icon
          icon="plus-sign"
          size="small"
        >
          <FormattedMessage id="ui-dashboard.dashboard.newWidget" values={{ label: widget.label }} />
        </Icon>
      </Button>
    );
  };

  // Diasbling here because eslint seems to think this is a component-level prop,
  // when it is actually passed from Dropdown

  // eslint-disable-next-line react/prop-types
  const renderWidgetMenu = ({ onToggle }) => {
    return (
      <DropdownMenu
        data-role="menu"
        onToggle={onToggle}
      >
        {widgetOptions.map(w => renderWidgetOption(w))}
      </DropdownMenu>
    );
  };

  return (
    <div className={css.dashboardHeader}>
      <Dropdown
        buttonProps={{
          'buttonStyle': 'primary',
          'marginBottom0': true,
        }}
        label={<FormattedMessage id="ui-dashboard.dashboardHeader.new" />}
        renderMenu={renderWidgetMenu}
      />
    </div>
  );
}

DashboardHeader.propTypes = propTypes;
