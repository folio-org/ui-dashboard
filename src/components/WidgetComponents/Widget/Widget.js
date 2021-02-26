import React from 'react';
import PropTypes from 'prop-types';

import WidgetHeader from './WidgetHeader';

import css from './Widget.css';

const Widget = ({
  children,
  widget
}) => {
  return (
    <div className={css.widgetContainer}>
      <div
        className={css.card}
      >
        <WidgetHeader
          key={`widget-header-${widget.id}`}
          name={widget.name}
          widgetId={widget.id}
        />
        <div
          key={`widget-body-${widget.id}`}
          className={css.body}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Widget.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  widget: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired
};

export default Widget;
