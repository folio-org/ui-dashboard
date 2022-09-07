import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './Loading.css';

export default function Loading() {
  return (
    <div className={css.loadingMessage}>
      <span className={css.loadingMessageLabel}> <FormattedMessage id="ui-dashboard.loading" /> </span>
    </div>
  );
}
