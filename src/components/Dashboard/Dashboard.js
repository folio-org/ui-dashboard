import React from 'react';
import PropTypes from 'prop-types';

import DashboardHeader from './DashboardHeader';
import NoWidgets from './NoWidgets';

import css from './Dashboard.css';

import ContextualWidget from '../WidgetComponents/ContextualWidget/ContextualWidget';

const propTypes = {
  dashboardId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object)
};

const Dashboard = ({ dashboardId, onCreate, onReorder, onWidgetDelete, onWidgetEdit, widgets }) => {
  const renderWidget = (widget) => (
    <ContextualWidget
      widget={widget}
      widgetComponentProps={{
        key: `${widget.definition.type.name}-${widget.id}`,
        widget
      }}
      widgetProps={{
        key: `widget-${widget.id}`,
        onWidgetDelete,
        onWidgetEdit,
        widget
      }}
    />
  );


  const dashboardContents = () => {
    if (!widgets?.length) {
      return <NoWidgets />;
    }
    return (
      <div className={css.widgetContainer}>
        {widgets.map(w => renderWidget(w))}
      </div>
    );
  };
  return (
    <div className={css.dashboard}>
      <DashboardHeader
        key={`dashboard-header-${dashboardId}`}
        onCreate={onCreate}
        onReorder={onReorder}
      />
      <div className={css.dashboardContent}>
        {dashboardContents()}
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.propTypes = propTypes;
