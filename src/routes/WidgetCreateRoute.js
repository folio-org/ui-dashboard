import React, { useState } from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQuery } from 'react-query';

import WidgetForm from '../components/WidgetForm';
import getComponentsFromType from '../components/getComponentsFromType';


const WidgetCreateRoute = ({
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  // Query setup for the dashboard/definitions/POST/PUT
  const { data: dashboard = {} } = useQuery(
    ['ui-dashboard', 'widgetCreateRoute', 'getDash'],
    () => ky(`servint/dashboard/${params.dashId}`).json()
  );

  const { mutateAsync: postWidget } = useMutation(
    ['ui-dashboard', 'widgetCreateRoute', 'postWidget'],
    (data) => ky.post('servint/widgets/instances', { json: data })
  );

  const { data: widgetDefinitions } = useQuery(
    ['ui-dashboard', 'widgetCreateRoute', 'getWidgetDefs'],
    () => ky('servint/widgets/definitions/global').json()
  );
  const [selectedDefinition, setSelectedDef] = useState();

  const {
    submitManipulation,
    createInitialValues,
    WidgetFormComponent
  } = getComponentsFromType(selectedDefinition?.type?.name ?? '');

  const initialValues = {
    widgetConfig: {
      ...createInitialValues(selectedDefinition)
    }
  };

  const handleClose = (id) => {
    history.push({
      pathname: `/dashboard/${params.dashId}`,
      ...(id && { state: id })
    });
  };

  const doTheSubmit = ({
    definition: _d,
    name,
    widgetConfig
  }) => {
    const tweakedWidgetConf = submitManipulation(widgetConfig);
    // Stringify the configuration
    const conf = JSON.stringify({
      ...tweakedWidgetConf
    });
    // Include other necessary metadata
    const submitValue = {
      definitionName: selectedDefinition.name,
      definitionVersion: selectedDefinition.version,
      name,
      owner: { id: dashboard.id },
      configuration: conf
    };
    // New widget, POST and close
    postWidget(submitValue)
      .then(data => data.json())
      .then(({ id }) => handleClose(id));
  };

  return (
    <Form
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
                // Pass initialValues in here so we can manually initialize when they're fetched
                initialValues,
                params,
                selectedDefinition,
                widgetDefinitions,
                WidgetFormComponent
              }}
              handlers={{
                onClose: () => handleClose(params.widgetId),
                onSubmit: handleSubmit,
                setSelectedDef
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
      dashId: PropTypes.string,
      widgetId: PropTypes.string,
    })
  }).isRequired
};
