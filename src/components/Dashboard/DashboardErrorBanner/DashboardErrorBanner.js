import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MessageBanner, TextLink } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import css from './DashboardErrorBanner.css';

const DashboardErrorBanner = ({ viewErrorHandler }) => {
  return (
    <MessageBanner type="error">
      <FormattedMessage id="ui-dashboard.simpleSearch.noContent" />
      <TextLink
        className={css.viewDetailsButton}
        data-test-error-boundary-production-error-details-button
        element="button"
        onClick={viewErrorHandler}
        type="button"
      >
        <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
      </TextLink>
    </MessageBanner>
  );
};

DashboardErrorBanner.propTypes = {
  viewErrorHandler: PropTypes.func,
};
export default DashboardErrorBanner;
