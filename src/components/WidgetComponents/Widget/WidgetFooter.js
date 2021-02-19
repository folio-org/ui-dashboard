import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';
import css from './WidgetFooter.css';

const WidgetFooter = ({
  onRefresh,
  rightContent,
  timestamp,
  widgetId
}) => {
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
          icon="replace"
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
  rightContent: PropTypes.oneOf([PropTypes.node, PropTypes.func]),
  timestamp: PropTypes.string,
  widgetId: PropTypes.string.isRequired
};

export default WidgetFooter;
