# Change history for ui-dashboard
## 2.2.0 In progress
  * ERM-2107 / ERM-2085 Refactor away from react-intl-safe-html
  * ERM-2097 Replace babel-eslint with @babel/eslint-parser

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
