import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import Loading from '../components/Dashboard/Loading';
import ReorderForm from '../components/ReorderForm';

const DashboardOrderRoute = ({
  history,
  match: {
    params: {
      dashId
    }
  }
}) => {
  const ky = useOkapiKy();

  // Load specific dashboard
  const { data: dashboard, isLoading: dashboardLoading } = useQuery(
    ['ERM', 'dashboard', dashId],
    () => ky(`servint/dashboard/${dashId}`).json(),
  );

  // The PUT for the dashboardOrdering
  const { mutateAsync: putDashOrder } = useMutation(
    ['ui-dashboard', 'dashboardOrderRoute', 'putDashboard'],
    (data) => ky.put(`servint/dashboard/${dashId}`, { json: data })
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

export default DashboardOrderRoute;

DashboardOrderRoute.propTypes = {
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
