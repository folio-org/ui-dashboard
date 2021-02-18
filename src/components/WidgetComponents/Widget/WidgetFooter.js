import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';
import css from './WidgetFooter.css';

const WidgetFooter = ({
  centerContent,
  onRefresh,
  rightContent,
  timestamp
}) => {
  return (
    <div
      className={css.footerContainer}
    >
      <div className={css.leftContent}>
        <IconButton
          icon="replace"
          onClick={onRefresh}
        />
        <div className={css.timestamp}>
          {timestamp}
        </div>
      </div>
      <div className={css.rightContent}>
        {rightContent}
      </div>
    </div>
  );
};

WidgetFooter.propTypes = {
};

export default WidgetFooter;
