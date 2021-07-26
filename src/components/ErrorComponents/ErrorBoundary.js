import { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorBanner from './ErrorBanner';

/*
 * NOTE this is a class component because there is currently
 * no way to natively replace componentDidCatch with a hook
 *
 * Acts similarly to errorBoundary in stripes, but returns a dashboard ErrorBanner
*/
export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]),
    onError: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      stack: undefined,
    };
  }

  componentDidCatch(error, info) {
    const { componentStack } = info;

    const lines = componentStack.toString().split('\n')
      // Remove empty lines
      .filter(Boolean);

    const stack = lines
      .map(str => str.replace(/\s+/, ''))
      .join('\n');

      // Error message seems to include stack as well, split on newline
      const errorMessage = error.message.split('\n')[0];

    this.setState({ error: errorMessage, stack });
  }


  render() {
    const { error, stack } = this.state;
    const { children } = this.props;
    if (error) {
      return (
        <ErrorBanner
          viewErrorHandler={
            () => this.props.onError(error, stack)
          }
        />
      );
    }

    return children;
  }
}

