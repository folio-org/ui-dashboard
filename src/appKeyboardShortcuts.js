import React from 'react';
import { FormattedMessage } from 'react-intl';

const appKeyboardShortcuts = [
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.createRecord" />),
    name: 'new',
    shortcut: 'alt + n',
  },
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.editRecord" />),
    name: 'edit',
    shortcut: 'mod + alt + e',
  },
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.saveRecord" />),
    name: 'save',
    shortcut: 'mod + s',
  },
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.expandAll" />),
    name: 'expandAllSections',
    shortcut: 'mod + alt + b'
  },
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.collapseAll" />),
    name: 'collapseAllSections',
    shortcut: 'mod + alt + g'
  },
  {
    label: (<FormattedMessage id="ui-dashboard.shortcut.expandOrCollapse" />),
    name: 'expandOrCollapseAccordion',
    shortcut: 'spacebar'
  },
];

export default appKeyboardShortcuts;
