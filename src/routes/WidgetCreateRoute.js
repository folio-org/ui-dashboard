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
    const tweakedWidgetConf = { ...widgetConf };
    // Remove tokens, for each filterColumn map the existing rules onto a comparator/value pair
    const tweakedFilterColumns = tweakedWidgetConf.filterColumns?.map(fc => {
      const tweakedRules = [...fc.rules]?.map(fcr => {
        if (fcr.relativeOrAbsolute === 'relative') {
          // We have a token, adapt the output value
          let outputValue = '';
          switch (fc.fieldType) {
            // For dates we build something of the form {{currentDate#23#w}}
            case 'Date':
              outputValue += '{{currentDate';
              if (fcr.offset && fcr.offset !== '0') {
                // Can be minus, default is positive
                outputValue += `#${fcr.offsetMethod === 'subtract' ? '-' : ''}${fcr.offset}`;
                if (fcr.timeUnit) {
                  outputValue += `#${fcr.timeUnit}`;
                }
              }
              outputValue += '}}';
              break;
            case 'UUID':
              outputValue = '{{currentUser}}';
              break;
            default:
              // Unknown, try to pass an existing filterValue
              outputValue = fcr.filterValue;
              break;
          }
          return ({
            comparator: fcr.comparator,
            filterValue: outputValue
          });
        }
        // This isn't a token, escape
        return fcr;
      });
      return ({
        name: fc.name,
        rules: tweakedRules
      });
    });
    // Set the filter columns to be the new ones including tokens
    tweakedWidgetConf.filterColumns = tweakedFilterColumns;
    
    // Stringify the configuration
    const conf = JSON.stringify({
      ...tweakedWidgetConf
    });
    // Include other necessary metadata
    const submitValue = { definition, name, owner: { id: dashboard.id }, configuration: conf };
    // Post and close
    postWidget(submitValue)
      .then(handleClose);
  };

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
