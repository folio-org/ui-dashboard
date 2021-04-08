import React from 'react';
import { FormattedMessage } from 'react-intl';

// TODO figure out lazy loading of functions
import simpleSearchSubmitManipulation from './WidgetForm/SimpleSearch/formParsing/submitWithTokens';
import simpleSearchWidgetToInitialValues from './WidgetForm/SimpleSearch/formParsing/widgetToInitialValues';

const ErrorComponent = React.lazy(() => import('./Dashboard/ErrorPage/ErrorComponent'));

// Lazy-load SimpleSearch components/functions
const SimpleSearch = React.lazy(() => import('./WidgetComponents/SimpleSearch/SimpleSearch'));
const SimpleSearchForm = React.lazy(() => import('./WidgetForm/SimpleSearch/SimpleSearchForm'));

// This function ensures all of the switching logic between differing WidgetTypes happens in a single place,
// and then passes the relevant components in a bundled object.
const getComponentsFromType = (widgetType) => {
  const componentBundle = {};

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
    case 'SimpleSearch': {
      componentBundle.WidgetComponent = SimpleSearch;
      componentBundle.WidgetFormComponent = SimpleSearchForm;

      componentBundle.submitManipulation = simpleSearchSubmitManipulation;
      componentBundle.widgetToInitialValues = simpleSearchWidgetToInitialValues;
      break;
    }
    default:
      componentBundle.WidgetComponent = WidgetComponentError;
      componentBundle.WidgetFormComponent = WidgetFormComponentError;
      componentBundle.submitManipulation = (props) => (props);
      componentBundle.widgetToInitialValues = (props) => (props);
  }

  return componentBundle;
};

export default getComponentsFromType;

