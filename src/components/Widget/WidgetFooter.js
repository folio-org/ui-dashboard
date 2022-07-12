import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { IconButton } from '@folio/stripes/components';
import css from './WidgetFooter.css';

const WidgetFooter = ({
  widgetName,
  onRefresh,
  rightContent,
  timestamp,
  widgetId
}) => {
  const intl = useIntl();
  return (
    <div
      className={css.footerContainer}
    >
      <div
        key={`widget-footer-${widgetId}-left-content`}
        className={css.leftContent}
      >
        <IconButton
          key={`widget-footer-${widgetId}-refresh-icon`}
          ariaLabel={
            intl.formatMessage(
              { id: 'ui-dashboard.widgetFooter.refreshButtonLabel' },
              { widgetName }
            )
          }
          icon="refresh"
          iconSize="small"
          onClick={onRefresh}
        />
        <div
          key={`widget-footer-${widgetId}-timestamp`}
          className={css.timestamp}
        >
          {timestamp}
        </div>
      </div>
      <div
        key={`widget-footer-${widgetId}-right-content`}
        className={css.rightContent}
      >
        {rightContent}
      </div>
    </div>
  );
};

WidgetFooter.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  rightContent: PropTypes.object,
  timestamp: PropTypes.string,
  widgetName: PropTypes.string.isRequired,
  widgetId: PropTypes.string.isRequired
};

export default WidgetFooter;
