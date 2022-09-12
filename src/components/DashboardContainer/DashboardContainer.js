/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */

import PropTypes from 'prop-types';

import Header from './Header';
import css from './DashboardContainer.css';
import Dashboard from '../Dashboard';

const propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  dashboards: PropTypes.arrayOf(PropTypes.shape({
    dashboard: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  })).isRequired,
  onCreateDashboard: PropTypes.func.isRequired,
  onCreateWidget: PropTypes.func.isRequired,
  onDeleteDashboard: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onManageDashboards: PropTypes.func.isRequired,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};

const DashboardContainer = ({
  dashboard,
  dashboards,
  onCreateDashboard,
  onCreateWidget,
  onDeleteDashboard,
  onEdit,
  onManageDashboards,
  onReorder,
  onUserAccess,
  onWidgetDelete,
  onWidgetEdit,
  widgets
}) => {
  return (
    <>
      <div className={css.dashboardContainer}>
        <Header
          key={`dashboard-header-${dashboard.id}`}
          dashboard={dashboard}
          dashboards={dashboards}
          onCreateDashboard={onCreateDashboard}
          onCreateWidget={onCreateWidget}
          onDeleteDashboard={onDeleteDashboard}
          onEdit={onEdit}
          onManageDashboards={dashboards?.length > 1 ? onManageDashboards : null}
          onReorder={widgets?.length > 1 ? onReorder : null}
          onUserAccess={onUserAccess}
        />
        <Dashboard
          dashboard={dashboard}
          onWidgetDelete={onWidgetDelete}
          onWidgetEdit={onWidgetEdit}
          widgets={widgets}
        />
      </div>
    </>
  );
};

export default DashboardContainer;
DashboardContainer.propTypes = propTypes;
