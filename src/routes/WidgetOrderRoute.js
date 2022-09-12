import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQueryClient } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import Loading from '../components/Loading';
import ReorderForm from '../components/ReorderForm';

const WidgetOrderRoute = ({
  dashboard,
  dashboardQuery: {
    isLoading: dashboardLoading
  },
  history,
  match: {
    params: {
      dashId
    }
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  // TODO we can maybe combine this with the "EditDashboard" page, since they use the same call
  // The PUT for the dashboardOrdering
  const { mutateAsync: putDashOrder } = useMutation(
    ['ERM', 'Dashboard', dashId, 'putDashboard'],
    (data) => ky.put(`servint/dashboard/${dashId}`, { json: data }).then(() => {
      queryClient.invalidateQueries(['ERM', 'Dashboard', dashId]);
      queryClient.invalidateQueries(['ERM', 'Dashboards']);
    })
  );

  if (dashboardLoading) {
    return (
      <Loading />
    );
  }

  const handleClose = () => {
    history.push(`/dashboard/${dashId}`);
  };

  const doTheSubmit = (values) => (
    putDashOrder(values).then(handleClose)
  );

  return (
    <Form
      enableReinitialize
      initialValues={{ ...dashboard,
        widgets: dashboard.widgets.sort(
          (a, b) => { return a.weight - b.weight; }
        ) }}
      keepDirtyOnReinitialize
      mutators={{
        ...arrayMutators
      }}
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ values: true }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <ReorderForm
            dashboard={dashboard}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </form>
      )}
    </Form>
  );
};

export default WidgetOrderRoute;

WidgetOrderRoute.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    widgets: PropTypes.arrayOf(PropTypes.object),
  }),
  dashboardQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      dashId: PropTypes.string
    })
  }).isRequired
};
