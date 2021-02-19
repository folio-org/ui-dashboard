import React from 'react';
import PropTypes from 'prop-types';

import { Headline } from '@folio/stripes/components';

import css from './WidgetHeader.css';

const WidgetHeader = ({
  name,
  widgetId,
}) => {
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
        ...
      </span>
    </div>
  );
};

WidgetHeader.propTypes = {
  name: PropTypes.string.isRequired,
  widgetId: PropTypes.string.isRequired
};

export default WidgetHeader;
