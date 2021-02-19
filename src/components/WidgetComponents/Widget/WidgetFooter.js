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
        className={css.leftContent}
        key={`widget-footer-${widgetId}-left-content`}
      >
        <IconButton
          icon="replace"
          onClick={onRefresh}
          key={`widget-footer-${widgetId}-refresh-icon`}
        />
        <div
          className={css.timestamp}
          key={`widget-footer-${widgetId}-timestamp`}
        >
          {timestamp}
        </div>
      </div>
      <div
        className={css.rightContent}
        key={`widget-footer-${widgetId}-right-content`}
      >
        {rightContent}
      </div>
    </div>
  );
};

WidgetFooter.propTypes = {
};

export default WidgetFooter;
