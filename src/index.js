import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
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
} from '@folio/stripes/components';

import PropTypes from 'prop-types';

import { ermDefaultKeyboardShortcuts } from '@folio/stripes-erm-components';
import appKeyboardShortcuts from './appKeyboardShortcuts';

// ERM-1735: took out the lazy load, causing errors with keyboard shortcuts / stripes-react-hotkeys,
// see also https://folio-project.slack.com/archives/CAN13SWBF/p1580423284014600
// and https://folio-project.slack.com/archives/CAYCU07SN/p1612187220027000
import DashboardsRoute from './routes/DashboardsRoute';
import DashboardRoute from './routes/DashboardRoute';
import DashboardOrderRoute from './routes/DashboardOrderRoute';
import WidgetCreateRoute from './routes/WidgetCreateRoute';

import Settings from './settings';

const App = (appProps) => {
  const { actAs, history, location, match: { path } } = appProps;
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  if (actAs === 'settings') {
    return (
      <Settings {...appProps} />
    );
  }

  const commands = appKeyboardShortcuts.concat(ermDefaultKeyboardShortcuts);

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
      <CommandList commands={commands}>
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
            <Route component={WidgetCreateRoute} path={`${path}/:dashName/create`} />
            <Route component={WidgetCreateRoute} path={`${path}/:dashName/:widgetId/edit`} />
            <Route component={DashboardOrderRoute} path={`${path}/:dashName/editOrder`} />
            <Route component={DashboardRoute} path={`${path}/:dashName`} />
            <Route component={DashboardsRoute} path={path} />
          </Switch>
        </HasCommand>
      </CommandList>
      {isShortcutsModalOpen && (
      <KeyboardShortcutsModal
        allCommands={commands}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
        )}
    </>
  );
};

App.eventHandler = (event, _s, data) => {
  if (event === 'ui-stripes-registry-load') {
    // DATA should contain registry singleton
    data.registerResource('widget');
  }

  return null;
};

App.propTypes = {
  actAs: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default App;
