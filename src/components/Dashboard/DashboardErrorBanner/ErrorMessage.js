import React from 'react';
import PropTypes from 'prop-types';
import { Headline, MessageBanner } from '@folio/stripes/components';
import css from './ErrorMessage.css';

const ErrorMessage = ({ error, stack, id }) => (
  <MessageBanner
    className={css.message}
    contentClassName={css.message__content}
    icon={null}
    id={id}
    type="error"
  >
    <Headline
      className={css.error}
      size="large"
      tag="h3"
    >
      {error}
    </Headline>
    <pre className={css.stack}>
      {stack}
    </pre>
  </MessageBanner>
);

ErrorMessage.propTypes = {
  error: PropTypes.node,
  id: PropTypes.string,
  stack: PropTypes.node,
};

export default ErrorMessage;
