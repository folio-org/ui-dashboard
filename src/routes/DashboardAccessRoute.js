import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';

import orderBy from 'lodash/orderBy';

import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import Loading from '../components/Loading';

import UserAccessFieldArray from '../components/UserAccessFieldArray';

const SORT_BY_NAME = [['user.personal.lastName', 'user.personal.firstName'], ['asc', 'asc']];

const DashboardAccessRoute = ({
  areUsersLoading,
  dashboard,
  dashboardQuery: {
    isLoading: dashboardLoading
  },
  dashboardUsers = [],
  dashboardUsersQuery: {
    isFetching: dashboardUsersLoading
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
  const callout = useCallout();

  // The POST for setting dashboard users
  const { mutateAsync: postDashUsers } = useMutation(
    ['ERM', 'dashboard', 'postUsers'],
    (data) => ky.post(`servint/dashboard/${dashId}/users`, { json: data }).json()
      .then(() => {
        callout.sendCallout({ message: <FormattedMessage id="ui-dashboard.dashboardUsers.edit.success" values={{ dashboardName: dashboard.name }} /> });
      })
  );

  // Allow this state to change WITHOUT reinitialising form to enable sorting
  const [initialAccess, setInitialAccess] = useState(dashboardUsers);

  if (dashboardLoading || areUsersLoading || dashboardUsersLoading) {
    return (
      <Loading />
    );
  }

  const handleClose = () => {
    history.push(`/dashboard/${dashId}`);
  };

  const doTheSubmit = (values) => {
    postDashUsers(values.access).then(() => {
      handleClose();

      queryClient.invalidateQueries(['ERM', 'Dashboards']);
      queryClient.invalidateQueries(['ERM', 'Dashboard', 'Users', dashId]);
    });
  };

  return (
    <Form
      // Manipulate initialValues into only the shape we need
      initialValues={{
        access: initialAccess
      }}
      keepDirtyOnReinitialize
      mutators={{
        ...arrayMutators,
        sortByName: (_args, state, tools) => {
          const access = tools.getIn(state, 'formState.values.access') || [];
          const sortedAccess = orderBy(access, SORT_BY_NAME[0], SORT_BY_NAME[1]);

          const newState = tools.setIn(state, 'formState.values.access', sortedAccess);
          Object.assign(state, newState);
          setInitialAccess(orderBy(dashboardUsers, SORT_BY_NAME[0], SORT_BY_NAME[1]));
        },
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
  areUsersLoading: PropTypes.bool,
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  dashboardQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
  }),
  dashboardUsers: PropTypes.arrayOf(PropTypes.object),
  dashboardUsersQuery: PropTypes.shape({
    isFetching: PropTypes.bool.isRequired
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
