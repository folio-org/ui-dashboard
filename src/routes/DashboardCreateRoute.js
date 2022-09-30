import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Form } from 'react-final-form';

import { useMutation, useQueryClient } from 'react-query';

import { useCallout, useOkapiKy } from '@folio/stripes/core';

import DashboardForm from '../components/DashboardForm';

const DashboardCreateRoute = ({
  history,
  match: {
    params
  }
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const callout = useCallout();

  const { mutateAsync: postDashboard } = useMutation(
    ['ERM', 'Dashboard', 'postDashboard'],
    (data) => ky.post('servint/dashboard', { json: data })
      .json()
      .then(res => {
        callout.sendCallout({ message: <FormattedMessage id="ui-dashboard.dashboard.create.success" values={{ dashboardName: res.name }} /> });
        history.push(`/dashboard/${res.id}`); // Will redirect user to new board
        queryClient.invalidateQueries(['ERM', 'Dashboards']);
      })
  );

  const handleClose = () => {
    history.push(`/dashboard/${params.dashId}`); // Will redirect user to board they came from
  };

  return (
    <Form
      initialValues={{}}
      navigationCheck
      onSubmit={postDashboard}
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

export default DashboardCreateRoute;

DashboardCreateRoute.propTypes = {
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
