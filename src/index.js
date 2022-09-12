import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Switch } from 'react-router-dom';
import { AppContextMenu, Route } from '@folio/stripes/core';

import {
  CommandList,
  HasCommand,
  KeyboardShortcutsModal,
  NavList,
  NavListItem,
  NavListSection,
  checkScope,
  importShortcuts,
  renameShortcutLabels
} from '@folio/stripes/components';

import PropTypes from 'prop-types';

// ERM-1735: took out the lazy load, causing errors with keyboard shortcuts / stripes-react-hotkeys,
// see also https://folio-project.slack.com/archives/CAN13SWBF/p1580423284014600
// and https://folio-project.slack.com/archives/CAYCU07SN/p1612187220027000
import DashboardsRoute from './routes/DashboardsRoute';
import DashboardRoute from './routes/DashboardRoute';
import DashboardCreateRoute from './routes/DashboardCreateRoute';
import DashboardEditRoute from './routes/DashboardEditRoute';
import DashboardAccessRoute from './routes/DashboardAccessRoute';
import WidgetOrderRoute from './routes/WidgetOrderRoute';
import WidgetCreateRoute from './routes/WidgetCreateRoute';
import WidgetEditRoute from './routes/WidgetEditRoute';


const App = ({ history, location, match: { path } }) => {
  const intl = useIntl();
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const appSpecificShortcuts = importShortcuts(['new', 'edit', 'save', 'expandAllSections', 'collapseAllSections', 'expandOrCollapseAccordion', 'openShortcutModal']);

  const renamedShortcuts = renameShortcutLabels(appSpecificShortcuts,
    [
      { 'shortcut': 'new', 'label': intl.formatMessage({ id: 'ui-dashboard.shortcut.new' }) },
      { 'shortcut': 'edit', 'label': intl.formatMessage({ id: 'ui-dashboard.shortcut.edit' }) },
      { 'shortcut': 'save', 'label': intl.formatMessage({ id: 'ui-dashboard.shortcut.save' }) },
    ]);

  const goToNew = () => {
    history.push(`${location.pathname}/create`);
  };

  const shortcuts = [
    {
      name: 'new',
      handler: goToNew,
    },
    {
      name: 'openShortcutModal',
      handler: () => setIsShortcutsModalOpen(true),
    }
  ];


  return (
    <>
      <CommandList commands={renamedShortcuts}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <AppContextMenu>
            {(_handleToggle) => (
              <NavList>
                <NavListSection>
                  <NavListItem
                    id="keyboard-shortcuts-item"
                    onClick={() => { setIsShortcutsModalOpen(true); }}
                  >
                    <FormattedMessage id="ui-dashboard.appMenu.keyboardShortcuts" />
                  </NavListItem>
                </NavListSection>
              </NavList>
            )}
          </AppContextMenu>
          <Switch>
            <Route component={DashboardsRoute} path={`${path}/:dashId?`}>
              {/*
                * Set up like this as a function so DashboardsRoute
                * can pass down information such as dashboards without
                * us needing to fetch them again
                */}
              {(dashboardsProps) => {
                // Pass each inner route all of dashboardsProps
                const DashboardsRouterRoute = ({ component: Component, path: innerPath }) => (
                  <Route
                    path={innerPath}
                    render={(routeProps) => (
                      <Component
                        {...routeProps}
                        {...dashboardsProps}
                      />
                    )}
                  />
                );

                DashboardsRouterRoute.propTypes = {
                  path: PropTypes.string.isRequired,
                  component: PropTypes.oneOfType([
                    PropTypes.func,
                    PropTypes.object,
                  ])
                };

                return (
                  <Switch>
                    <DashboardsRouterRoute component={DashboardCreateRoute} path={`${path}/:dashId/create`} />
                    <DashboardsRouterRoute component={DashboardEditRoute} path={`${path}/:dashId/edit`} />
                    <DashboardsRouterRoute component={WidgetCreateRoute} path={`${path}/:dashId/createWidget`} />
                    <DashboardsRouterRoute component={WidgetEditRoute} path={`${path}/:dashId/:widgetId/edit`} />
                    <DashboardsRouterRoute component={DashboardAccessRoute} path={`${path}/:dashId/userAccess`} />
                    <DashboardsRouterRoute component={WidgetOrderRoute} path={`${path}/:dashId/editOrder`} />
                    <DashboardsRouterRoute component={DashboardRoute} path={`${path}/:dashId`} />
                  </Switch>
                );
              }}
            </Route>
          </Switch>
        </HasCommand>
      </CommandList>
      {isShortcutsModalOpen && (
        <KeyboardShortcutsModal
          allCommands={renamedShortcuts}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
      )}
    </>
  );
};

App.eventHandler = (event, _s, data) => {
  if (event === 'LOAD_STRIPES_REGISTRY') {
    // DATA should contain registry singleton
    data.registerResource('widget');
  }

  return null;
};

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default App;
