import React from 'react';
import PropTypes from 'prop-types';
import { Headline, MessageBanner } from '@folio/stripes/components';
import css from './ErrorMessage.css';

const ErrorMessage = ({ errorMessage, stack, id }) => (
  <MessageBanner
    className={css.message}
    contentClassName={css.message__content}
    data-test-error-boundary-message
    icon={null}
    id={id}
    type="error"
  >
    <Headline
      className={css.error}
      data-test-error-boundary-message-error
      size="large"
      tag="h3"
    >
      Error: {errorMessage}
    </Headline>
    <pre className={css.stack} data-test-error-boundary-message-stack-trace>
      {stack}
    </pre>
  </MessageBanner>
);

ErrorMessage.propTypes = {
  errorMessage: PropTypes.node,
  id: PropTypes.string,
  stack: PropTypes.node,
};

export default ErrorMessage;
