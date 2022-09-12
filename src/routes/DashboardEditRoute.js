import { useOkapiKy } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { useMutation, useQueryClient } from 'react-query';

import DashboardForm from '../components/DashboardForm';

const DashboardEditRoute = ({
  dashboard,
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const { mutateAsync: putDashboard } = useMutation(
    ['ERM', 'Dashboard', params.dashId, 'putDashboard'],
    (data) => ky.put(`servint/dashboard/${params.dashId}`, { json: data }).then(() => {
      queryClient.invalidateQueries(['ERM', 'Dashboard', params.dashId]);
      queryClient.invalidateQueries(['ERM', 'Dashboards']);
    })
  );

  const handleClose = () => {
    history.push(`/dashboard/${params.dashId}`);
  };

  const doTheSubmit = (values) => {
    putDashboard(values);
    handleClose();
  };

  return (
    <Form
      initialValues={dashboard}
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ values: true }}
    >
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <DashboardForm
              handlers={{
                onClose: () => handleClose(),
                onSubmit: handleSubmit,
              }}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default DashboardEditRoute;

DashboardEditRoute.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
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
      dashId: PropTypes.string,
    })
  }).isRequired
};
