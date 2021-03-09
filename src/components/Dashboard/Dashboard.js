import React from 'react';
import PropTypes from 'prop-types';

import DashboardHeader from './DashboardHeader';
import NoWidgets from './NoWidgets';

import SimpleSearch from '../WidgetComponents/SimpleSearch/SimpleSearch';
import { Widget } from '../WidgetComponents/Widget';

import css from './Dashboard.css';

const propTypes = {
  dashboardId: PropTypes.string.isRequired,
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object)
};

const Dashboard = ({ dashboardId, onCreate, onReorder, widgets }) => {
  const getWidgetComponent = (widget) => {
    const widgetType = widget.definition.type.name;
    switch (widgetType) {
      case 'SimpleSearch':
        return (
          <SimpleSearch
            key={`simple-search-${widget.id}`}
            widget={widget}
          />
        );
      default:
        // TODO add real error here
        return `No widget component for type: ${widgetType}`;
    }
  };

  const renderWidget = (widget) => {
    return (
      <Widget
        key={`widget-${widget.id}`}
        widget={widget}
      >
        {getWidgetComponent(widget)}
      </Widget>
    );
  };

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
