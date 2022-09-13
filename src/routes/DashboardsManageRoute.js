import PropTypes from 'prop-types';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { useMutation, useQueryClient } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import ManageDashboardsForm from '../components/ManageDashboardsForm';

const DashboardsManageRoute = ({
  dashboards,
  history,
  match: {
    params: {
      dashId
    }
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();

  const handleClose = () => {
    history.push(`/dashboard/${dashId}`);
  };

  const { mutateAsync: putUserDashboards } = useMutation(
    ['ERM', 'Dashboards', 'putUserDashboards'],
    (data) => ky.put('servint/dashboard/my-dashboards', { json: data }).then(() => {
      queryClient.invalidateQueries(['ERM', 'Dashboards']);
    })
  );

  const doTheSubmit = (values) => (
    putUserDashboards(values.dashboards).then(handleClose)
  );

  return (
    <Form
      enableReinitialize
      initialValues={{ dashboards }}
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
          <ManageDashboardsForm
            dashboards={dashboards}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </form>
      )}
    </Form>
  );
};

DashboardsManageRoute.propTypes = {
  dashboards: PropTypes.arrayOf(PropTypes.shape({
    dashboard: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  dashboardsQuery: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired,
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


export default DashboardsManageRoute;
