import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Route, coreEvents, HandlerManager } from '@folio/stripes/core';

import PropTypes from 'prop-types';
import Registry from './Registry';

const Settings = lazy(() => import('./settings'));
const DashboardsRoute = lazy(() => import('./routes/DashboardsRoute'));
const DashboardRoute = lazy(() => import('./routes/DashboardRoute'));
const DashboardOrderRoute = lazy(() => import('./routes/DashboardOrderRoute'));
const WidgetCreateRoute = lazy(() => import('./routes/WidgetCreateRoute'));

const App = (appProps) => {
  const { actAs, match: { path } } = appProps;
  if (actAs === 'settings') {
    return (
      <Suspense fallback={null}>
        <Settings {...appProps} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <Switch>
        <Route component={WidgetCreateRoute} path={`${path}/:dashName/create`} />
        <Route component={WidgetCreateRoute} path={`${path}/:dashName/:widgetId/edit`} />
        <Route component={DashboardOrderRoute} path={`${path}/:dashName/editOrder`} />
        <Route component={DashboardRoute} path={`${path}/:dashName`} />
        <Route component={DashboardsRoute} path={path} />
      </Switch>
    </Suspense>
  );
};

// TODO if we can figure out how to obtain modules object outside of a component, use the following directly
/*   modules.handler.forEach(mod => {
    const m = mod.getModule();
    console.log("M: %o", m)
    const handler = m[mod.handlerName]
    console.log ("handler: %o", handler)
    handler('ui-dashboard-registry-load', stripes, Registry)
  }); */

// Track whether we've already fired the dash event with a boolean
let registryEventFired = false;
App.eventHandler = (event, stripes, data) => {
  if (event === coreEvents.LOGIN) {
    // Ensure event only fired once
    if (registryEventFired === false) {
      registryEventFired = true;
      return () => (
        <HandlerManager
          data={Registry}
          event="ui-dashboard-registry-load"
          stripes={stripes}
        />
      );
    }
  }

  if (event === 'ui-dashboard-registry-load') {
    // DATA should contain registry singleton
    data.registerResource('widget');
  }

  return null;
};

App.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default App;
