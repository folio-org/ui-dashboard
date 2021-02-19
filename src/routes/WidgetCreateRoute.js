import React from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { useMutation, useQuery } from 'react-query';


import WidgetForm from '../components/WidgetForm/WidgetForm';

const WidgetCreateRoute = ({
  history,
  location,
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

  const doTheSubmit = (widget) => {
    // TODO this is just a hard coded configuration for now
    const conf = JSON.stringify({
      resultColumns:[
        {
          name:'agreementName',
          label:'Name'
        },
        {
          name:'startDate'
        }
      ],
      filterColumns:[
        {
          comparator: '==',
          name:'agreementStatus',
          filterValue:'active'
        },
        {
          comparator: '<',
          name: 'startDate',
          filterValue: '2021-02-21'
        }
      ],
      sortColumn:[
        {
          name:'agreementName',
          sortType:'asc'
        }
      ]
    });

    const submitValue = { ...widget, owner: { id: dashboard.id }, configuration: conf };
    postWidget(submitValue)
      .then(() => {
        history.push(`dashboard/${params.dashName}`);
      });
  };

  const handleClose = () => {
    history.push(`dashboard/${params.dashName}${location.search}`);
  };

  // TODO have this form move onto page 2 instead of submitting hardcoded widget

  return (
    <Form
      // initialValues={initialValues}
      enableReinitialize
      keepDirtyOnReinitialize
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ value: true }}
    >
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <WidgetForm
              data={{
                widgetDefinitions
              }}
              handlers={{
                onSubmit: handleSubmit,
                onClose: handleClose
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
      dashName: PropTypes.string
    })
  }).isRequired
};
