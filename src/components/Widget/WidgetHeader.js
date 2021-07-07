import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Headline,
  IconButton,
  Icon
} from '@folio/stripes/components';

import css from './WidgetHeader.css';

const WidgetHeader = ({
  name,
  onWidgetDelete,
  onWidgetEdit,
  widgetId,
}) => {
  const intl = useIntl();
  // eslint-disable-next-line react/prop-types
  const renderActionMenuToggle = ({ onToggle, triggerRef, keyHandler, ariaProps, getTriggerProps }) => (
    <IconButton
      ref={triggerRef}
      aria-label={
        intl.formatMessage(
          { id: 'ui-dashboard.widgetHeader.actionsButtonLabel' },
          { widgetName: name }
        )
      }
      icon="ellipsis"
      onClick={onToggle}
      onKeyDown={keyHandler}
      {...getTriggerProps()}
      {...ariaProps}
    />
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenuContent = () => (
    <DropdownMenu>
      <Button
        aria-label={
          intl.formatMessage(
            { id: 'ui-dashboard.widgetHeader.editButtonLabel' },
            { widgetName: name }
          )
        }
        buttonStyle="dropdownItem"
        id="clickable-new-widget"
        onClick={() => onWidgetEdit(widgetId)}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-dashboard.widgetHeader.editButton" />
        </Icon>
      </Button>
      <Button
        aria-label={
          intl.formatMessage(
            { id: 'ui-dashboard.widgetHeader.deleteButtonLabel' },
            { widgetName: name }
          )
        }
        buttonStyle="dropdownItem"
        id="clickable-reorderdashboard"
        // We have to feed the widgetDelete the name as well for the confirmation modal
        onClick={() => onWidgetDelete(widgetId, name)}
      >
        <Icon icon="trash">
          <FormattedMessage id="ui-dashboard.widgetHeader.deleteButton" />
        </Icon>
      </Button>
    </DropdownMenu>
  );

  const renderDropDownMenu = () => (
    <Dropdown
      key="widget-header-actions-menu-toggle"
      renderMenu={renderActionMenuContent}
      renderTrigger={renderActionMenuToggle}
    />
  );

  return (
    <div
      className={css.header}
    >
      <span className={css.widgetTitle}>
        <Headline
          key={`widget-header-headline-${widgetId}`}
          margin="none"
          size="large"
        >
          {name}
        </Headline>
      </span>
      <span>
        {renderDropDownMenu()}
      </span>
    </div>
  );
};

WidgetHeader.propTypes = {
  name: PropTypes.string.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgetId: PropTypes.string.isRequired
};

export default WidgetHeader;
