import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useMutation, useQueryClient } from 'react-query';
import { useCallout, useOkapiKy } from '@folio/stripes/core';

import { ERMForm } from '@folio/stripes-erm-components';

import DashboardForm from '../components/DashboardForm';

const DashboardEditRoute = ({
  dashboard,
  dashboardUsers,
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const callout = useCallout();

  const handleClose = () => {
    history.push(`/dashboard/${params.dashId}`);
  };

  const { mutateAsync: putDashboard } = useMutation(
    ['ERM', 'Dashboard', params.dashId, 'putDashboard'],
    (data) => ky.put(`servint/dashboard/${params.dashId}`, { json: data }).json()
      .then(res => {
        callout.sendCallout({ message: <FormattedMessage id="ui-dashboard.dashboard.edit.success" values={{ dashboardName: res.name }} /> });

        queryClient.invalidateQueries(['ERM', 'Dashboard', params.dashId]);
        queryClient.invalidateQueries(['ERM', 'Dashboards']);

        // Handle close needs to be async when working with ERMForm
        handleClose();
      })
  );

  return (
    <ERMForm
      initialValues={dashboard}
      onSubmit={putDashboard}
      subscription={{ values: true }}
    >
      {({ handleSubmit, pristine, submitting }) => (
        <DashboardForm
          dashboardUsers={dashboardUsers}
          handlers={{
            onClose: () => handleClose(),
            onSubmit: handleSubmit,
          }}
          pristine={pristine}
          submitting={submitting}
        />
      )}
    </ERMForm>
  );
};

DashboardEditRoute.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }),
  dashboardQuery: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
  }),
  dashboardUsers: PropTypes.arrayOf(PropTypes.object),
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

export default DashboardEditRoute;
