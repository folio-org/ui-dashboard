import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';
import PropTypes from 'prop-types';

const Settings = lazy(() => import('./settings'));
const DashboardRoute = lazy(() => import('./routes/DashboardRoute'));
const WidgetCreateRoute = lazy(() => import('./routes/WidgetCreateRoute'));

class App extends React.Component {
  static propTypes = {
    actAs: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
  }

  render() {
    const { actAs, match: { path } } = this.props;

    if (actAs === 'settings') {
      return (
        <Suspense fallback={null}>
          <Settings {...this.props} />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={null}>
        <Switch>
          <Route component={WidgetCreateRoute} path={`${path}/:dashName/create`} />
          <Route component={DashboardRoute} path={`${path}/:dashName`} />
          <Route component={DashboardRoute} path={path} />
        </Switch>
      </Suspense>
    );
  }
}

export default App;
