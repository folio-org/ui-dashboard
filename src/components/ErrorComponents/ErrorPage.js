import React from 'react';
import PropTypes from 'prop-types';

import css from './Error.css';

export default function ErrorPage({ children }) {
  return (
    <div className={css.errorPage}>
      <span className={css.errorMessageLabel}>
        <div>
          {children}
        </div>
      </span>
    </div>
  );
}

ErrorPage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
