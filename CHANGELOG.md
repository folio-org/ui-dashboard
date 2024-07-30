# Change history for ui-dashboard

## 6.1.0 In progress
* SI-64 Dashboard: Sort SimpleSearch fields
* SI-60 Dashboard: TokenUserPicker checks for permission that is not assigned

## 6.0.0 2023-03-22
* ERM-3129 Remove explicit typescript version
* ERM-3122 On editing a widget, the top of the widget configuration screen should display
* ERM-3121 Validate "Number of rows" field in KIWT / simple search based widgets
* ERM-3041 Dashboard: the "unsaved changes" confirmation modal is missing
* S-41 Improve error handling
* *BREAKING* Switched to servint interface 4

## 5.0.0 2023-10-12
  * Updated github workflows to allow use of multiple cores while running jest tests
  * ERM-3040 "New" badge is wrapping onto two lines
  * ERM-3014 Manage user access allows display of 10 users max
  * ERM-3001 Update Node.js to v18 in GitHub Actions
  * ERM-2980 Filters not completely cleared when editing widget
  * Dashboard canvas overhaul (refs ERM-1795, ERM-2972)
    * Widgets can now be resized/drag-dropped into place
    * Widget footer is now independent from widget body
    * Major refactors to fetching of dahsboards/widget data
    * Minor refactors to routing/code in general to allow for more efficient redraws
    * Removed old "Manage widgets" action as it is rendered obsolete by changes
  * ERM-2967 Use useChunkedCQLFetch consistently across ERM
  * ERM-2934 Agreement lines simple search widget definition
  * ERM-2641 Upgrade to Grails 5 (including Hibernate 5.6.x) for Poppy
    * Added okapi interface dependency on new servint interface 3.0
  * STRIPES-870 *BREAKING* upgrade react to v18
    * ERM-2996 Upgrade ui-dashboard React to v18
  * SI-35 *BREAKING* bump `react-intl` to `v6.4.4`
    * ERM-3027 Update react-intl to v6
  * SI-25 In UI limit length of widget URL input to 2048 chars
  * SI-24 Avoid double encoding of user entered URLs in simple search widget

## 4.0.0 2023-02-22
  * ERM-2575 fix deprecated default export from 'zustand' in ui-dashboard
  * ERM-2563 Increment ui-dashboard to Stripes v8
  * ERM-2534 Use responsive option group for dashboard names
  * ERM-2471 Fix dashboard keyboard shortcuts (or shortcuts documentation)
  * ERM-2460 Bump ui-dashboard erm-components dep
  * ERM-2314 Managed Dashboards UI: managing available dashboards
  * ERM-2313 Managed Dashboards UI: managing users access to a dashboard

## 3.0.3 2022-10-26
  * ERM-2350 When the user only has one dashboard, display the dashboard name in a header
  * ERM-2349 UX improvements for managed dashboards
  * ERM-2348 Dashboard management minor issues
  * ERM-2319 stripes-erm-components should be a peer
  * ERM-2312 Managed Dashboards: backend model (refactor to avoid regressions)
  * ERM-2154 update outdated dependencies in ui-dashboard
  * Bump to stripes-erm-components ^7.0.0

## 2.2.0 2022-07-04
  * ERM-2122 Remove Dashboard icon in settings section
  * ERM-2107 / ERM-2085 Refactor away from react-intl-safe-html
  * ERM-2097 Replace babel-eslint with @babel/eslint-parser
  * ERM-2081 Implement loading/spinner to avoid display of "An error occurred. No widget component for type"
  * ERM-2073 Agreement/license links missing in Dashboard widgets.

## 2.1.0 2022-03-02
  * ERM-1927 Cannot select options in option switcher in widget config
  * ERM-1899 Add Save and Close validation
  * ERM-1894 Upgrade `@folio/react-intl-safe-html` for compatibility with `@folio/stripes` `v7`.
  * ERM-1852 Dashboard: End date filter: make the Date form control inactive when the Comparator = "Is set" or "Is not set"
  * ERM-1792, ERM-1855 UX improvements for Dashboard.
  * ERM-1791 Dashboard: Make the "Edit widget display order" menu option inactive when less then 2 widgets exist
  * ERM-1761 Dashboard: Apply keyboard shortcuts modal guidelines
  * ERM-1704 Dashboard: columns are being reset to default when repositioned using drag and drop
  * ERM-1688 Dashboard: On "New" simple search widget, populate one column by default
  * ERM-1687 Dashboard: Prevent columns being added more than once in a simple search widget

## 2.0.0 2021-10-07
  * Upgrade to stripes v7
  * Improve the date filter comparator UX. ERM-1648, ERM-1839, ERM-1840
  * a11y improvements. ERM-1648, ERM-1788
  * Add keyboard shortcuts to ui-dashboard. ERM-1735, ERM-1736
  * ERM-1768 Registry: Move Registry class out of Dashboard and into dedicated repo

## 1.0.0 2021-06-16
  * ERM-1696 Add support for match + terms in simple search widget type
  * ERM-1655 Implement "No results found" message for simple search widget
  * ERM-1617 Add support for isSet and isNotset comparators in Simple Search Widget
  * ERM-1651/ERM-1652/ERM-1653 Fixes to RelativeOrAbsolute, changes to RenderWidget, DateTime (WIP) and Boolean filter support. Link/Array display support.
  * ERM-1657 Implement "dashboard not found" error
  * ERM-1658 Fixed incorrect token parsing, added path builder test.
  * ERM-1685 Create Link table component
  * ERM-1659 Update UI permission sets for Dashboard.
  * ERM-1643 Changes to WidgetDefinition, WidgetInstance and WidgetType shape. Other code tweaks.
  * ERM-1631 Use "Delete" rather than "Remove" for widget instance deletion
  * Registry setup event now only fires once
  * ERM-1654 Added URI encoding to filter strings to deal with special characters.
  * ERM-1611 Added framework for Registry.
  * ERM-1625 Code Cleanup.
    * final-form config changes and form bug fixes
    * Overhauled file structure
    * Fixed moment dependency
    * Fixes to how dashboard fetches widget components per Type
  * ERM-1613 Add basic Widget Actions.
  * ERM-1612 Edit existing dashboard widgetInstance.
  * ERM-1614 Fixed filter issue in date filter field.
  * Fixes to fetch ordering issues
  * split routing of all dashboards and specific dashboards
  * Form changes and UX improvements
  * SimpleTable css tweaks and fixes
  * Changed DragAndDropFieldArray to have proper handle
  * Made proper loading page
  * Fixes to form validation
  * ERM-1580 Added form to reorder widgets
  * ERM-1579 Added the ability to tokenise currentDate and currentUser
  * ERM-1562 Dynamic form rendering for simpleSearch widgets
  * ERM-1561 App displays SimpleSearch results in formatted table
  * App created
