import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './ErrorPage.css';

export default function ErrorPage({ children }) {
  return (
    <div className={css.errorMessage}>
      <span className={css.errorMessageLabel}>
        <FormattedMessage id="ui-dashboard.error" />
        {children}
      </span>
    </div>
  );
}
