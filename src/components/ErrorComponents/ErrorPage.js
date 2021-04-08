import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import css from './Error.css';

export default function ErrorPage({ children }) {
  return (
    <div className={css.errorPage}>
      <span className={css.errorMessageLabel}>
        <div>
          <FormattedMessage id="ui-dashboard.error" />
        </div>
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
