import React, { useState } from 'react';
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
      <WidgetHeader id={widget.id} key={`widget-header-${widget.id}`} name={widget.name}/>
      <div
        className={css.body}
        key={`widget-body-${widget.id}`}
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
