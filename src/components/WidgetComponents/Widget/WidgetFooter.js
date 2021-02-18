import React from 'react';
import PropTypes from 'prop-types';

import { IconButton } from '@folio/stripes/components';
import css from './WidgetFooter.css';

const WidgetFooter = ({
  onRefresh,
  timestamp
}) => {
  return (
    <div
      className={css.footer}
    >
      {timestamp}
    </div>
  );
};

WidgetFooter.propTypes = {
};

export default WidgetFooter;
