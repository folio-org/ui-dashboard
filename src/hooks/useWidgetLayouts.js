import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { utils } from 'react-grid-layout';
import { useMutation, useQueryClient } from 'react-query';
import { FormattedMessage } from 'react-intl';

import isEqualWith from 'lodash/isEqualWith';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

import { useCallout, useOkapiKy } from '@folio/stripes/core';
import { usePrevious } from '@folio/stripes-erm-components';

import { ignoreArrayOrderEqualityFunc } from '../utils';

import useMoveWidget from './useMoveWidget';
import useWindowResizing from './useWindowResizing';
import { COLUMNS, WIDGET_MINS } from '../constants/dashboardConstants';



/* Logical separation is a bit nmuddy here, this sets up
 * the states necessary for ReactGridLayout, and handles
 * new widgets being added etc, but ALSO performs the PUT
 * which is potentially an overreach for the name of the hook
 * However this allows us to keep the Dashboard component
 * purely about display of widgets, and much, much smaller
 *
 * Am not sure about the mutate call living in here, but for now it
 * is fine.
 */
const useWidgetLayouts = ({
  displayData,
  setDashboard, // If the edit call is moved back to the route, remove this drilled prop from tree
  widgets
}) => {
  // THE PUT FOR EDITING LAYOUT
  const ky = useOkapiKy();
  const callout = useCallout();
  const queryClient = useQueryClient();
  const { dashId } = useParams();
  // We will use this for reordering
  const { mutateAsync: editDashboard, isLoading: isEditing } = useMutation(
    ['ERM', 'Dashboard', dashId, 'EditDashboardLayout'],
    (data) => ky.put(`servint/dashboard/${dashId}`, { json: data }).json(),
    {
      onSuccess: (res) => {
        setDashboard(res);
        callout.sendCallout({ message: <FormattedMessage id="ui-dashboard.dashboard.edit.success" values={{ dashboardName: res.name }} /> });
        queryClient.invalidateQueries(['ERM', 'Dashboard', dashId]);
      }
    }
  );

  // Assume large until proven otherwise
  const [breakpointState, setBreakpointState] = useState(['lg', COLUMNS.lg]);

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
  const previousMovingWidget = usePrevious(movingWidget);

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
      editDashboard({
        displayData: JSON.stringify(layouts)
      }).then(() => {
        document.getElementById(`widget-drag-handle-${previousMovingWidget}`).focus();
      });
    }
  }, [
    displayData,
    editDashboard,
    isEditing,
    layouts,
    movingWidget,
    previousMovingWidget,
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
