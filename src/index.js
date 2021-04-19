import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';
import PropTypes from 'prop-types';
import Registry from '@folio/plugin-resource-registry';

const Settings = lazy(() => import('./settings'));
const DashboardsRoute = lazy(() => import('./routes/DashboardsRoute'));
const DashboardRoute = lazy(() => import('./routes/DashboardRoute'));
const DashboardOrderRoute = lazy(() => import('./routes/DashboardOrderRoute'));
const WidgetCreateRoute = lazy(() => import('./routes/WidgetCreateRoute'));

const registry = Registry;
registry.registerResource('widget');

const App = (appProps) => {
  const { actAs, match: { path } } = appProps;
  if (actAs === 'settings') {
    return (
      <Suspense fallback={null}>
        <Settings {...appProps} />
      </Suspense>
    );
  }

  const agreementFilterParams = {
    filters: [
      {
        filter: 'agremeentStatus',
        value: 'active'
      },
      {
        filter: 'agreementStatus',
        value: 'draft'
      }
    ],
    sort: 'name'
  };

  const agreementReg = registry.getResource('agreement');
  console.log('Agreement getAllTemplate: %o', agreementReg.performViewAllTemplate(agreementFilterParams));
  console.log('Agreement resource by id: %o', agreementReg.performViewTemplate({ id: '12345' }));

  const alReg = registry.getResource('agreementLine');
  console.log('Agreement line resource by id', alReg.performViewTemplate({ id: "54321", owner: { id: "abcde" } }))

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

App.propTypes = {
  actAs: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default App;
