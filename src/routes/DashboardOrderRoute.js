import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-final-form';


import { useMutation, useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import ReorderForm from '../components/Dashboard/ReorderForm';

const DashboardOrderRoute = ({
  history,
  location,
  match: {
    params: {
      dashName
    }
  }
}) => {
  const ky = useOkapiKy();

   // Load specific dashboard from name
   const { data: { 0: dashboard } = [], isLoading: dashboardLoading } = useQuery(
    ['ui-dashboard', 'dashboardRoute', 'dashboard'],
    () => ky(`servint/dashboard/my-dashboards?filters=name=${dashName}`).json(),
  );
  
  // The PUT for the dashboardOrdering
  const { mutateAsync: putDashOrder } = useMutation(
    ['ui-dashboard', 'widgetCreateRoute', 'putDashboard'],
    (data) => ky.put(`servint/dashboard/${dashboard?.id}`, { json: data })
  );

  if (dashboardLoading) {
    return (
      <p> LOADING ... </p>
    );
  }

  const handleSubmit = () => (
    alert("Submit stuff"),
    handleClose()
  );

  const handleClose = () => {
    history.push(`dashboard/${dashName}`);
  };

  return (
    <Form
      // initialValues={initialValues}
      enableReinitialize
      keepDirtyOnReinitialize
      navigationCheck
      onSubmit={handleSubmit}
      subscription={{ values: true }}
    >
       {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <ReorderForm
            dashboard={dashboard}
            onSubmit={handleSubmit}
            onClose={handleClose}
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
      dashName: PropTypes.string
    })
  }).isRequired
};
