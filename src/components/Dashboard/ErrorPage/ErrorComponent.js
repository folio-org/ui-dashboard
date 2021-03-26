import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import css from './Error.css';

export default function ErrorComponent({ children }) {
  return (
    <div className={css.errorComponent}>
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

ErrorComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
