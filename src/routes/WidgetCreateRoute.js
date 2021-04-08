import React, { useState } from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQuery } from 'react-query';

import WidgetForm from '../components/WidgetForm/WidgetForm';
import useWidgetDefinition from '../components/useWidgetDefinition';

/* This name may be a bit of a misnomer, as the route is used for both create AND edit */
const WidgetCreateRoute = ({
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  // Query setup for the dashboard/definitions/POST/PUT
  const { data: { 0: dashboard = {} } = [] } = useQuery(
    ['ui-dashboard', 'widgetCreateRoute', 'getDash'],
    () => ky(`servint/dashboard/my-dashboards?filters=name=${params.dashName}`).json()
  );

  const { data: widgetDefinitions } = useQuery(
    ['ui-dashboard', 'widgetCreateRoute', 'getWidgetDefs'],
    () => ky('servint/widgets/definitions').json()
  );

  const { mutateAsync: postWidget } = useMutation(
    ['ui-dashboard', 'widgetCreateRoute', 'postWidget'],
    (data) => ky.post('servint/widgets/instances', { json: data })
  );

  const { mutateAsync: putWidget } = useMutation(
    ['ui-dashboard', 'widgetCreateRoute', 'putWidget'],
    (data) => ky.put(`servint/widgets/instances/${params.widgetId}`, { json: data })
  );

  // If we have a widgetId then fetch that widget
  const { data: widget } = useQuery(
    // Ensure we refetch widget if widgetId changes
    ['ui-dashboard', 'widgetCreateRoute', 'getWidget', params.widgetId],
    () => ky(`servint/widgets/instances/${params.widgetId}`).json(),
    {
      /* Only run this query if the user has selected a widgetDefinition */
      enabled: !!params.widgetId
    }
  );

  /*
   * When the user selects a widgetDefinition it'll just be an id.
   * We will want to know the specific details for the definition (both in form and for submit)
   * so we fetch them again by way of a callback when the user makes their selection
   */
  const [defId, setDefId] = useState(widget?.definition?.id);
  const {
    // Get the type specific functions from useWidgetDef
    componentBundle: {
      submitManipulation,
      widgetToInitialValues
    }
  } = useWidgetDefinition(defId);

  // Set up initialValues for whichever type the edited widget is (or undefined for new widget)
  let initialValues;
  if (widget) {
    initialValues = widgetToInitialValues(widget);
  }

  const handleClose = () => {
    history.push(`/dashboard/${params.dashName}`);
  };

  const doTheSubmit = ({
    definition,
    name,
    ...widgetConf
  }) => {
    const tweakedWidgetConf = submitManipulation(widgetConf);
    // Stringify the configuration
    const conf = JSON.stringify({
      ...tweakedWidgetConf
    });
    // Include other necessary metadata
    const submitValue = { definition, name, owner: { id: dashboard.id }, configuration: conf };

    if (params.widgetId) {
      // Widget already exists, PUT and close
      putWidget(submitValue)
        .then(handleClose);
    } else {
      // New widget, POST and close
      postWidget(submitValue)
        .then(handleClose);
    }
  };

  return (
    <Form
      enableReinitialize
      initialValues={initialValues}
      keepDirtyOnReinitialize
      mutators={arrayMutators}
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ values: true }}
    >
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <WidgetForm
              data={{
                defId,
                params,
                widgetDefinitions
              }}
              handlers={{
                onClose: handleClose,
                onSubmit: handleSubmit,
                setDefId
              }}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default WidgetCreateRoute;

WidgetCreateRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      dashName: PropTypes.string,
      widgetId: PropTypes.string,
    })
  }).isRequired
};
