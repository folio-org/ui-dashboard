import React from 'react';
import PropTypes from 'prop-types';

import WidgetHeader from './WidgetHeader';

import css from './Widget.css';

const Widget = ({
  children,
  widget
}) => {
  return (
    <div
      className={css.card}
    >
      <WidgetHeader name={widget.name} />
      <div
        className={css.body}
      >
        {children}
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
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Widget;
