import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Route, coreEvents, useModules, useStripes } from '@folio/stripes/core';

import PropTypes from 'prop-types';
import setUpRegistry from './setUpRegistry';
import Registry from './Registry/Registry';

const Settings = lazy(() => import('./settings'));
const DashboardsRoute = lazy(() => import('./routes/DashboardsRoute'));
const DashboardRoute = lazy(() => import('./routes/DashboardRoute'));
const DashboardOrderRoute = lazy(() => import('./routes/DashboardOrderRoute'));
const WidgetCreateRoute = lazy(() => import('./routes/WidgetCreateRoute'));

// DO THIS BEFORE APP
setUpRegistry();

const App = (appProps) => {
  const { actAs, match: { path } } = appProps;
  if (actAs === 'settings') {
    return (
      <Suspense fallback={null}>
        <Settings {...appProps} />
      </Suspense>
    );
  }

  console.log("REGISTRY: %o", Registry)

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

// Small functional component to load registry stuff
const DashLoad = () => {
  const modules = useModules();
  const stripes = useStripes();

  // For each module, publish event `ui-dashboard-registry-load`
  modules.handler.forEach(mod => {
    const m = mod.getModule();
    console.log("M: %o", m)
    const handler = m[mod.handlerName]
    console.log ("handler: %o", handler)
    handler('ui-dashboard-registry-load', stripes, Registry)
  });

  return null;
}

App.eventHandler = (event, stripes, data) => {
  if (event === coreEvents.LOGIN) {
    return DashLoad;
  }

  if (event === 'ui-dashboard-registry-load') {
    // DATA should contain registry singleton
    data.registerResource('widget');
    return null;
  }
  return null;
}

App.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default App;
