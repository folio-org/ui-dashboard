import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';

import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

import { useOkapiKy } from '@folio/stripes/core';

import Loading from '../components/Dashboard/Loading';
import { useChunkedUsers } from '../components/hooks';

import UserAccessFieldArray from '../components/UserAccessFieldArray';

const DashboardAccessRoute = ({
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

  // Load dashboard users
  const { data: dashboardAccess = [], isLoading: dashboardAccessLoading } = useQuery(
    ['ui-dashboard', 'DashboardAccessRoute', 'dashboardAccess'],
    () => ky(`servint/dashboard/${dashId}/users`).json(),
  );

  // From the dashboard access, we need to fetch user information.
  // Batch fetch all users
  const { users, isLoading: areUsersLoading } = useChunkedUsers(dashboardAccess?.map(da => da?.user?.id), { enabled: !dashboardAccessLoading && dashboardAccess.length });

  // The POST for setting dashboard users
  const { mutateAsync: postDashUsers } = useMutation(
    ['ERM', 'dashboard', 'postUsers'],
    (data) => ky.post(`servint/dashboard/${dashId}/users`, { json: data })
  );

  if (dashboardLoading || areUsersLoading) {
    return (
      <Loading />
    );
  }

  const handleClose = () => {
    history.push(`/dashboard/${dashId}`);
  };

  const doTheSubmit = (values) => (
    postDashUsers(values.access).then(handleClose)
  );

  return (
    <Form
      enableReinitialize
      // Manipulate initialValues into only the shape we need
      initialValues={{
        access: dashboardAccess.map(da => ({
          access: da.access.value, // Allow us to receive and send refdata value instead of id
          id: da.id,
          user: users.find(usr => usr.id === da.user.id) ?? da.user.id, // If this is a flat id then we know we couldn't find the user
        }))
      }}
      keepDirtyOnReinitialize
      mutators={{
        ...arrayMutators
      }}
      navigationCheck
      onSubmit={doTheSubmit}
      subscription={{ values: true }}
    >
      {({ handleSubmit, pristine, submitting }) => (
        <form onSubmit={handleSubmit}>
          <FieldArray
            component={UserAccessFieldArray}
            dashboard={dashboard}
            name="access"
            onClose={handleClose}
            onSubmit={handleSubmit}
            pristine={pristine}
            submitting={submitting}
            triggerFormSubmit={handleSubmit}
          />
        </form>
      )}
    </Form>
  );
};

export default DashboardAccessRoute;

DashboardAccessRoute.propTypes = {
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
