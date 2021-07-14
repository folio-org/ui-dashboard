import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MessageBanner, TextLink } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import css from './DashboardErrorBanner.css';

const DashboardErrorBanner = ({ onShowModal }) => {
  return (
    <MessageBanner type="error">
      <FormattedMessage id="ui-dashboard.simpleSearch.noContent" />
      <TextLink
        className={css.viewDetailsButton}
        data-test-error-boundary-production-error-details-button
        element="button"
        onClick={onShowModal}
        type="button"
      >
        <FormattedMessage id="stripes-components.ErrorBoundary.detailsButtonLabel" />
      </TextLink>
    </MessageBanner>
  );
};

DashboardErrorBanner.propTypes = {
  onShowModal: PropTypes.func,
};
export default DashboardErrorBanner;
