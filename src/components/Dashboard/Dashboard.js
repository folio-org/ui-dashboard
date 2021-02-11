import React from 'react';
import PropTypes from 'prop-types';

import {
  Badge,
  Card,
  Headline
} from '@folio/stripes/components';
// import { AppIcon } from '@folio/stripes/core';

import DashboardHeader from '../DashboardHeader';
import NoWidgets from '../NoWidgets';

import SimpleSearch from '../WidgetComponents/SimpleSearch';

import css from './Dashboard.css';

const propTypes = {
  dashboard: PropTypes.object
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
        <Card
          cardStyle="positive"
          headerStart={(

            // TODO AppName not implemented, no way of knowing what Icon to display
            /* <AppIcon
              app={widget.appName}
              size="medium"
            >
              <Headline
                className={css.widgetTitle}
                margin="none"
                size="large"
              >
                {widget.name}
              </Headline>
            </AppIcon> */
            <Headline
              className={css.widgetTitle}
              margin="none"
              size="large"
            >
              {widget.name}
            </Headline>
          )
          }
          headerEnd={
            <Badge>
              23
            </Badge>
          }
          roundedBorder
        >
          {getWidgetComponent(widget)}
        </Card>
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
      <DashboardHeader onCreate={onCreate}/>
      <div className={css.dashboardContent}>
        {dashboardContents()}
      </div>
    </div>
  );
};

export default Dashboard;

Dashboard.propTypes = propTypes;
