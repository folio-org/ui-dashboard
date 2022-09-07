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
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  onCreateWidget: PropTypes.func.isRequired,
  onReorder: PropTypes.func,
  onUserAccess: PropTypes.func,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};

const DashboardContainer = ({
  dashboard,
  dashboards,
  onCreateWidget,
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
          onCreateWidget={onCreateWidget}
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
