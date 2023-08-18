import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Headline,
  IconButton,
  Icon
} from '@folio/stripes/components';

import css from './WidgetHeader.css';
import { useDashboardAccess } from '../../hooks';

const WidgetHeader = ({
  grabbed,
  name,
  onWidgetDelete,
  onWidgetEdit,
  widgetId,
  widgetMoveHandler
}) => {
  const intl = useIntl();
  let widgetFocusRef = useRef(null);
  const { state } = useLocation();
  const { dashId } = useParams();

  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  useEffect(() => {
    if (widgetId === state && widgetFocusRef.current) {
      widgetFocusRef.current.focus();
    }
  }, [state, widgetId]);

  // eslint-disable-next-line react/prop-types
  const renderActionMenuToggle = ({ onToggle, keyHandler, triggerRef, ariaProps, getTriggerProps }) => {
    widgetFocusRef = triggerRef;
    if (hasAccess('edit') || hasAdminPerm) {
      return (
        <IconButton
          ref={widgetFocusRef}
          ariaLabel={
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
    }

    return null;
  };

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
          <FormattedMessage id="ui-dashboard.delete" />
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

  const internalMoveHandler = useCallback(e => {
    widgetMoveHandler(e, widgetId);
  }, [widgetId, widgetMoveHandler]);

  return (
    <div
      className={css.header}
    >
      {(hasAccess('edit') || hasAdminPerm) ?
        <div
          aria-grabbed={grabbed}
          className="widget-drag-handle"
          id={`widget-drag-handle-${widgetId}`}
          onKeyDown={internalMoveHandler}
          role="menuitem" // This feels wrong, but there is no role for handle?
          style={{
            cursor: grabbed ? 'grabbing' : 'grab', // 'grabbing'
            height: 'auto',
            alignSelf: 'center'
          }}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <Icon icon="drag-drop" />
        </div> : null
      }
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
  grabbed: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgetId: PropTypes.string.isRequired,
  widgetMoveHandler: PropTypes.func.isRequired
};

export default WidgetHeader;
