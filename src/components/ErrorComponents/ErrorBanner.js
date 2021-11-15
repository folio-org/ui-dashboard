import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MessageBanner, TextLink } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import css from './ErrorBanner.css';

const ErrorBanner = ({ viewErrorHandler }) => {
  return (
    <MessageBanner type="error">
      <FormattedMessage id="ui-dashboard.simpleSearch.contentError" />
      <TextLink
        className={css.viewDetailsButton}
        element="button"
        onClick={viewErrorHandler}
        type="button"
      >
        <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
      </TextLink>
    </MessageBanner>
  );
};

ErrorBanner.propTypes = {
  viewErrorHandler: PropTypes.func,
};
export default ErrorBanner;
