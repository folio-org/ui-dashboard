import React from 'react';
import { FormattedMessage } from 'react-intl';

// TODO figure out lazy loading of functions
import simpleSearchSubmitManipulation from './TypeComponents/SimpleSearch/Form/formParsing/submitWithTokens';
import simpleSearchWidgetToInitialValues from './TypeComponents/SimpleSearch/Form/formParsing/widgetToInitialValues';
import simpleSearchCreateInitialValues from './TypeComponents/SimpleSearch/Form/formParsing/createInitialValues';


// ERM-1735: took out the lazy load, causing errors with keyboard shortcuts / stripes-react-hotkeys,
// see also https://folio-project.slack.com/archives/CAN13SWBF/p1580423284014600
// and https://folio-project.slack.com/archives/CAYCU07SN/p1612187220027000
import ErrorComponent from './ErrorComponents/ErrorComponent';
// SimpleSearch components/functions
import SimpleSearch from './TypeComponents/SimpleSearch/Widget/SimpleSearch';
import SimpleSearchForm from './TypeComponents/SimpleSearch/Form/SimpleSearchForm';

// This function ensures all of the switching logic between differing WidgetTypes happens in a single place,
// and then passes the relevant components in a bundled object.
const getComponentsFromType = (widgetType = '') => {
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
      componentBundle.createInitialValues = simpleSearchCreateInitialValues;
      break;
    }
    default:
      componentBundle.WidgetComponent = WidgetComponentError;
      componentBundle.WidgetFormComponent = WidgetFormComponentError;
      componentBundle.submitManipulation = (props) => (props);
      componentBundle.widgetToInitialValues = (props) => (props);
      componentBundle.createInitialValues = (props) => (props);
  }

  return componentBundle;
};

export default getComponentsFromType;

