import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { WidgetProvider } from './widgetContext';

const ErrorComponent = React.lazy(() => import('./Dashboard/ErrorPage/ErrorComponent'));

// Lazy-load SimpleSearch components/functions
const SimpleSearch = React.lazy(() => import('./WidgetComponents/SimpleSearch/SimpleSearch'));
const SimpleSearchForm = React.lazy(() => import('./WidgetForm/SimpleSearch/SimpleSearchForm'));
const simpleSearcSubmitManipulation = React.lazy(() => import('./WidgetForm/SimpleSearch/formParsing/submitWithTokens'));
const simpleSearchWidgetToInitialValues = React.lazy(() => import('./WidgetForm/SimpleSearch/formParsing/widgetToInitialValues'));

const useWidget = (widgetType) => {
  // TODO potentially rewrite to expose components directly rather than via a context
  const providerProps = {};

  const WidgetComponentError = () => (
    <ErrorComponent>
      <FormattedMessage id="ui-dashboard.error.noWidgetComponentForType" values={{ widgetType }} />
    </ErrorComponent>
  );

  const WidgetFormComponentError = () => (
    <ErrorComponent>
      <FormattedMessage id="ui-dashboard.error.noWidgetFormComponentForType" values={{ widgetType }} />
    </ErrorComponent>
  );

  switch (widgetType) {
    case 'SimpleSearch':
      providerProps.WidgetComponent = SimpleSearch;
      providerProps.WidgetFormComponent = SimpleSearchForm;
      providerProps.submitManipulation = simpleSearcSubmitManipulation;
      providerProps.widgetToInitialValues = simpleSearchWidgetToInitialValues;
      break;
    default:
      providerProps.WidgetComponent = WidgetComponentError;
      providerProps.WidgetFormComponent = WidgetFormComponentError;
      providerProps.submitManipulation = (props) => (props);
      providerProps.widgetToInitialValues = (props) => (props);
  }

  const WidgetContextProvider = ({ children }) => {
    return (
      <WidgetProvider value={providerProps}>
        {children}
      </WidgetProvider>
    );
  };

  WidgetContextProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  return {
    WidgetProvider: WidgetContextProvider
  };
};

export default useWidget;
