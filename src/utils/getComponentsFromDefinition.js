import { FormattedMessage } from 'react-intl';

import { Spinner } from '@folio/stripes/components';

// TODO figure out lazy loading of functions
import simpleSearchSubmitManipulation from '../components/TypeComponents/SimpleSearch/Form/formParsing/submitWidget';
import simpleSearchWidgetToInitialValues from '../components/TypeComponents/SimpleSearch/Form/formParsing/widgetToInitialValues';
import simpleSearchCreateInitialValues from '../components/TypeComponents/SimpleSearch/Form/formParsing/createInitialValues';

// ERM-1735: took out the lazy load, causing errors with keyboard shortcuts / stripes-react-hotkeys,
// see also https://folio-project.slack.com/archives/CAN13SWBF/p1580423284014600
// and https://folio-project.slack.com/archives/CAYCU07SN/p1612187220027000
import ErrorComponent from '../components/ErrorComponents/ErrorComponent';
// SimpleSearch components/functions
import {
  SimpleSearch,
  SimpleSearchFooter,
  SimpleSearchForm
} from '../components/TypeComponents/SimpleSearch';

import css from '../Style.css';

const noop = (props) => (props);

// This function ensures all of the switching logic between differing WidgetTypes happens in a single place,
// and then passes the relevant components in a bundled object.

const getComponentsFromDefinition = ({
  // Can pass definitionName OPTIONALLY, if passed it'll use for error where definition couldn't be fetched
  definitionName,
  isLoading = false,
  selectedDefinition = {},
}) => {
  // If we have no selectedDefinition, return error components;
  if (!Object.keys(selectedDefinition).length) {
    const NoDefinitionError = () => (
      definitionName ?
        <ErrorComponent>
          <FormattedMessage id="ui-dashboard.error.noWidgetDefinitionForName" values={{ defName: definitionName }} />
        </ErrorComponent> :
        <ErrorComponent>
          <FormattedMessage id="ui-dashboard.error.noWidgetDefinition" />
        </ErrorComponent>
    );

    return {
      WidgetComponent: NoDefinitionError,
      WidgetFormComponent: NoDefinitionError,
      submitManipulation: noop,
      widgetToInitialValues: noop,
      createInitialValues: noop,
    };
  }

  const { type: { name: widgetType = '' } = {} } = selectedDefinition;
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

  if (isLoading) {
    return {
      WidgetComponent: () => (<Spinner className={css.spinner} />),
      WidgetFormComponent: () => (<Spinner className={css.spinner} />),
      submitManipulation: noop,
      widgetToInitialValues: noop,
      createInitialValues: noop,
    };
  }

  switch (widgetType) {
    case 'SimpleSearch': {
      componentBundle.WidgetComponent = SimpleSearch;
      componentBundle.FooterComponent = SimpleSearchFooter;
      componentBundle.WidgetFormComponent = SimpleSearchForm;

      componentBundle.submitManipulation = simpleSearchSubmitManipulation;
      componentBundle.widgetToInitialValues = simpleSearchWidgetToInitialValues;
      componentBundle.createInitialValues = simpleSearchCreateInitialValues;
      break;
    }
    default:
      componentBundle.WidgetComponent = WidgetComponentError;
      componentBundle.WidgetFormComponent = WidgetFormComponentError;
      componentBundle.submitManipulation = noop;
      componentBundle.widgetToInitialValues = noop;
      componentBundle.createInitialValues = noop;
  }

  return componentBundle;
};

export default getComponentsFromDefinition;

