import React from 'react';
import PropTypes from 'prop-types';

import DashboardHeader from '../DashboardHeader';
import NoWidgets from '../NoWidgets';

import SimpleSearch from '../WidgetComponents/SimpleSearch';
import Widget from '../WidgetComponents/Widget';

import css from './Dashboard.css';

const propTypes = {
  dashboard: PropTypes.object,
  onCreate: PropTypes.func.isRequired
};

const Dashboard = ({ dashboard, onCreate }) => {
  const getWidgetComponent = (widget) => {
    const widgetType = widget.definition.type.name;
    switch (widgetType) {
      case 'SimpleSearch':
        return (
          <SimpleSearch
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
      <div className={css.widget}>
        <Widget
          widget={widget}
        >
          {getWidgetComponent(widget)}
        </Widget>
      </div>
    );
  };

  const dashboardContents = () => {
    const widgetList = dashboard?.widgets;
    if (!widgetList?.length) {
      return <NoWidgets />;
    }
    return (
      <div className={css.widgetContainer}>
        {
          // TODO WEIGHT NOT YET IMPLEMENTED
          /* .sort(
          (a, b) => {
            if (a.weight > b.weight) return 1;
            else if (b.weight > a.weight) return -1;
            return 0;
          }
        ).
        */
        widgetList.map(w => renderWidget(w))
        }
      </div>
    );
  };
  return (
    <div className={css.dashboard}>
      <DashboardHeader onCreate={onCreate} />
      <div className={css.dashboardContent}>
        {dashboardContents()}
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.propTypes = propTypes;
