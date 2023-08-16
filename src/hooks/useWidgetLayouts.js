import { useEffect, useState } from 'react';
import { utils } from 'react-grid-layout';

import isEqualWith from 'lodash/isEqualWith';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

import { ignoreArrayOrderEqualityFunc } from '../utils';

import useMoveWidget from './useMoveWidget';
import useWindowResizing from './useWindowResizing';
import { COLUMNS, WIDGET_MINS } from '../constants/dashboardConstants';

const useWidgetLayouts = ({
  displayData,
  isEditing,
  onEditDashboard,
  widgets
}) => {
  const [layouts, setLayouts] = useState(() => {
    if (displayData) {
      return JSON.parse(displayData);
    }

    // If no display data, default to a nice grid
    return {
      lg: widgets.map((w, i) => (
        {
          x: (i * WIDGET_MINS.x) % COLUMNS?.lg,
          minH: WIDGET_MINS.y,
          minW: WIDGET_MINS.x,
          w: WIDGET_MINS.x,
          y: 0,
          h: WIDGET_MINS.y,
          i: w.id
        }
      ))
    };
  });

  // Assume large until proven otherwise
  const [breakpointState, setBreakpointState] = useState(['lg', COLUMNS.lg]);

  const {
    movingWidget,
    setMovingWidget,
    widgetMoveHandler,
  } = useMoveWidget({
    breakpointState,
    layouts,
    setLayouts
  });

  const windowResizing = useWindowResizing();
  // Ensure that new widgets get set up with a default layout
  useEffect(() => {
    // Grab all widgets which do not exist in lg layout
    const newWidgets = widgets?.filter(w => !layouts?.lg?.find(lw => lw.i === w.id))?.map((w, i) => {
      return (
        {
          x: (i * WIDGET_MINS.x) % COLUMNS?.lg,
          minH: WIDGET_MINS.y,
          minW: WIDGET_MINS.x,
          w: WIDGET_MINS.x,
          y: 0,
          h: WIDGET_MINS.y,
          i: w.id
        }
      );
    });

    if (newWidgets.length) {
      setLayouts({
        lg: [
          ...utils.cloneLayout(layouts?.lg ?? []),
          ...newWidgets
        ],
        // TODO TEST that this works when saving and redrawing from saved data
        // Then can maybe delete md and sm below
        md: [
          ...utils.cloneLayout(layouts?.md ?? []),
          ...newWidgets
        ],
        sm: [
          ...utils.cloneLayout(layouts?.sm ?? []),
          ...newWidgets
        ]
      });
    }

    // SAVE LAYOUT WHEN CHANGED
    // Parse out display data
    const parsedDisplayData = JSON.parse(displayData ?? '{}');

    // Remove undefined keys from deep objects for comparison
    const parsedDisplayDataNoNil = {};
    Object.keys(parsedDisplayData).forEach(k => {
      parsedDisplayDataNoNil[k] = parsedDisplayData[k].map(obj => omitBy(obj, isNil));
    });
    const layoutsNoNil = {};
    Object.keys(layouts).forEach(k => {
      layoutsNoNil[k] = layouts[k].map(obj => omitBy(obj, isNil));
    });

    if (
      !movingWidget &&
      !isEditing &&
      !windowResizing &&
      !isEqualWith(layoutsNoNil, parsedDisplayDataNoNil, ignoreArrayOrderEqualityFunc)
    ) {
      onEditDashboard({
        displayData: JSON.stringify(layouts)
      }).then((returnData) => {
        // Safety check, don't set layouts if no displayData came back
        if (returnData.displayData) {
          setLayouts(JSON.parse(returnData?.displayData));
        }
      });
    }
  }, [
    displayData,
    isEditing,
    layouts,
    movingWidget,
    onEditDashboard,
    widgets,
    windowResizing
  ]);

  return ({
    breakpointState,
    layouts,
    movingWidget,
    setBreakpointState,
    setMovingWidget,
    setLayouts,
    widgetMoveHandler
  });
};

export default useWidgetLayouts;
