import React from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQuery } from 'react-query';

import WidgetForm from '../components/WidgetForm/WidgetForm';

const WidgetCreateRoute = ({
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
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

  const handleClose = () => {
    history.push(`dashboard/${params.dashName}`);
  };

  const doTheSubmit = ({
    definition,
    name,
    ...widgetConf
  }) => {
    const { filterColumns, ...restOfConf } = widgetConf;

    // Flatten the filter columns we get from the form
    let flattenedFilterColumns;
    if (filterColumns) {
      flattenedFilterColumns = [];
      filterColumns.forEach(fc => {
        fc.rules.forEach(rule => {
          flattenedFilterColumns.push({ ...rule, name: fc.name });
        });
      });
    }

    // TODO this is just a mostly hard coded configuration for now
    const conf = JSON.stringify({
      ...restOfConf,
      filterColumns: flattenedFilterColumns,
      sortColumn:[
        {
          name:'agreementName',
          sortType:'asc'
        }
      ]
    });

    const submitValue = { definition, name, owner: { id: dashboard.id }, configuration: conf };
    postWidget(submitValue)
      .then(handleClose);
  };

  // TODO have this form move onto page 2 instead of submitting hardcoded widget
  return (
    <Form
      // initialValues={initialValues}
      enableReinitialize
      keepDirtyOnReinitialize
      mutators={arrayMutators}
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ values: true }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <WidgetForm
            data={{
              widgetDefinitions
            }}
            handlers={{
              onClose: handleClose,
              onSubmit: handleSubmit
            }}
          />
        </form>
      )}
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
      dashName: PropTypes.string
    })
  }).isRequired
};
