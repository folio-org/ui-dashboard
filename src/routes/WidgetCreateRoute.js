import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import PropTypes from 'prop-types';

import { Form } from 'react-final-form';

import WidgetForm from '../components/WidgetForm/WidgetForm';

const WidgetCreateRoute = ({
  history,
  location,
  match: {
    params
  },
  mutator,
  resources: {
    widgetDefs: {
      records: widgetDefinitions = []
    } = {},
    dashboard: {
      records : {
        0: dashboard = {}
      } = []
    } = {},
  }
}) => {
  const doTheSubmit = (widget) => {
    const dashId = dashboard.id;

    // TODO this is just a hard coded configuration for now
    const conf = JSON.stringify({
      resultColumns:[
        {
          name:'agreementName',
          label:'Overwritten column label'
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
          comparator: '==',
          name:'agreementStatus',
          filterValue:'closed'
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
          sortType:'desc'
        }
      ]
    });

    const submitValue = { ...widget, owner: { id: dashId }, configuration: conf };

    return mutator.widgetInst
      .POST(submitValue)
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

export default stripesConnect(WidgetCreateRoute);

WidgetCreateRoute.manifest = Object.freeze({
  widgetDefs: {
    type: 'okapi',
    path: 'servint/widgets/definitions',
    shouldRefresh: () => false,
  },
  dashboard: {
    type: 'okapi',
    path: (_p, params) => {
      return `servint/dashboard/my-dashboards?filters=name=${params.dashName}`;
    }
  },
  widgetInst: {
    // Disable GET
    GET: {
      path: () => {
        return null;
      }
    },
    type: 'okapi',
    path: 'servint/widgets/instances',
    shouldRefresh: () => false,
  },
});

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
  }).isRequired,
  mutator: PropTypes.object,
  resources: PropTypes.shape({
    dashboard: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    widgetDefs: PropTypes.object
  })
};
