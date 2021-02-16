import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './NoWidgets.css';

export default function NoWidgets() {
  return (
    <div className={css.noResultsMessage}>
      <span className={css.noResultsMessageLabel}> <FormattedMessage id="ui-dashboard.noWidgets" /> </span>
    </div>
  );
}
