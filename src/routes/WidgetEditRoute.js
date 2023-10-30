import React, { useEffect, useState } from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { getComponentsFromType } from '../utils';

import WidgetForm from '../components/WidgetForm';

const WidgetEditRoute = ({
  dashboard,
  dashboardUsers = [],
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const { mutateAsync: putWidget } = useMutation(
    ['ERM', 'Dashboard', params.dashId, 'putWidget'],
    (data) => ky.put(`servint/widgets/instances/${params.widgetId}`, { json: data }).then(() => {
      queryClient.invalidateQueries(['ERM', 'Dashboard', params.dashId]);
    })
  );

  // If we have a widgetId then fetch that widget
  const { data: widget, refetch: refetchWidgetInstance } = useQuery(
    // Ensure we refetch widget if widgetId changes
    ['ui-dashboard', 'widgetCreateRoute', 'getWidget', params.widgetId],
    () => ky(`servint/widgets/instances/${params.widgetId}`).json(),
    {
      /* Only run this query if we have an existing widgetInstance */
      enabled: !!params.widgetId
    }
  );

  // Fetch list of widgetDefinitions (Should only be 1 if widget already exists)

  // Construct NS like this so that if widget does NOT exist, we can reuse cache from call in WidgetCreateRoute
  const queryNS = ['ERM', 'WidgetDefinitions'];
  if (widget?.id) {
    queryNS.push(widget?.id);
  }

  const { data: widgetDefinitions } = useQuery(
    queryNS,
    () => ky(`servint/widgets/definitions/global${widget ? '?name=' + widget.definition?.name + '&version=' + widget.definition?.version : ''}`).json()
  );
  const [selectedDefinition, setSelectedDef] = useState();


  useEffect(() => {
    // Widget may need a render cycle to be fetched, if and when it does get fetched set selectedDef to it
    if (widget) {
      setSelectedDef(widgetDefinitions?.[0]);
    }
  }, [widget, widgetDefinitions]);

  const {
    submitManipulation,
    widgetToInitialValues,
    WidgetFormComponent
  } = getComponentsFromType(selectedDefinition?.type?.name ?? '');

  let initialValues = {};
  if (widget) {
    initialValues = {
      definition: 0,
      ...widgetToInitialValues(widget, selectedDefinition)
    };
  } else {
    initialValues = {
      ...widgetToInitialValues(widget, selectedDefinition)
    };
  }

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

    // Widget already exists, PUT and close
    putWidget(submitValue)
      .then(() => handleClose(params.widgetId))
      // Ensure we refetch the widgetInstance after submit.
      // This ensures we aren't initially getting a memoized version on next edit.
      .then(refetchWidgetInstance);
  };

  return (
    <Form
      initialValues={initialValues}
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
                dashId: params.dashId,
                dashboardUsers,
                // Pass initialValues in here so we can manually initialize when they're fetched
                initialValues,
                name: widget?.name,
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

export default WidgetEditRoute;

WidgetEditRoute.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  dashboardQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
  }),
  dashboardUsers: PropTypes.arrayOf(PropTypes.object),
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
