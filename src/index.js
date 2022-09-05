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
import DashboardIdRoute from './routes/DashboardIdRoute';
import DashboardRoute from './routes/DashboardRoute';
import DashboardAccessRoute from './routes/DashboardAccessRoute';
import DashboardOrderRoute from './routes/DashboardOrderRoute';
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
            <Route component={DashboardIdRoute} path={`${path}/:dashId`}>
              <Switch>
                <Route component={WidgetCreateRoute} path={`${path}/:dashId/create`} />
                <Route component={WidgetEditRoute} path={`${path}/:dashId/:widgetId/edit`} />
                <Route component={DashboardAccessRoute} path={`${path}/:dashId/userAccess`} />
                <Route component={DashboardOrderRoute} path={`${path}/:dashId/editOrder`} />
                <Route component={DashboardRoute} path={`${path}/:dashId`} />
              </Switch>
            </Route>
            <Route component={DashboardsRoute} path={path} />
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
