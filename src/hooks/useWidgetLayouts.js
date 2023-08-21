import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { utils } from 'react-grid-layout';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import isEqualWith from 'lodash/isEqualWith';
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

import { useOkapiKy } from '@folio/stripes/core';
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
  widgets
}) => {
  // THE PUT FOR EDITING LAYOUT
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const { dashId } = useParams();

  const [layouts, setLayouts] = useState();

  // Assume large until proven otherwise
  const [breakpointState, setBreakpointState] = useState(['lg', COLUMNS.lg]);

  // Storing this in state to try and avoid weird locking issues?
  const [displayData, setDisplayData] = useState();

  // Specific layout work
  const { mutateAsync: editDashboardLayout, isLoading: isEditing } = useMutation(
    ['ERM', 'Dashboard', dashId, 'EditDashboardLayout'],
    (data) => ky.put(`servint/dashboard/${dashId}/displayData`, { json: data }).json()
      .then((res) => {
        setDisplayData(res);
        queryClient.invalidateQueries(['ERM', 'Dashboard', dashId, 'Layout']);
      }),
  );

  const { isFetching: isDisplayDataLoading } = useQuery(
    ['ERM', 'Dashboard', dashId, 'Layout'],
    () => ky.get(`servint/dashboard/${dashId}/displayData`).json()
      .then(res => {
        setDisplayData(res);
        if (res.layoutData) {
          setLayouts(JSON.parse(res.layoutData));
        }
      })
  );

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
    // Don't do anything until we have displayData (And the state has _actually_ been set)
    // There appears to be an issue with react-query where the loading state
    // changes before the data state?
    if (!isDisplayDataLoading && displayData) {
      // Once we've got the populated display data, now run all the following
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
        setLayouts(currentLayouts => ({
          lg: [
            ...utils.cloneLayout(currentLayouts?.lg ?? []),
            ...newWidgets
          ],
          md: [
            ...utils.cloneLayout(currentLayouts?.md ?? []),
            ...newWidgets
          ],
          sm: [
            ...utils.cloneLayout(currentLayouts?.sm ?? []),
            ...newWidgets
          ]
        }));
      }

      // Parse out display data
      // NOTE this shouldn't be set to layout if empty
      const parsedDisplayData = JSON.parse(displayData?.layoutData ?? '{}');

      // Remove undefined keys from deep objects for comparison
      const parsedDisplayDataNoNil = {};
      Object.keys(parsedDisplayData).forEach(k => {
        parsedDisplayDataNoNil[k] = parsedDisplayData[k].map(obj => omitBy(obj, isNil));
      });
      const layoutsNoNil = {};
      Object.keys(layouts ?? {}).forEach(k => {
        layoutsNoNil[k] = layouts?.[k].map(obj => omitBy(obj, isNil));
      });

      if (
        !movingWidget &&
        !isEditing &&
        !windowResizing &&
        !!layouts && // Don't PUT an empty object to layouts
        !isEqualWith(layoutsNoNil, parsedDisplayDataNoNil, ignoreArrayOrderEqualityFunc)
      ) {
        // Lock the layouts again before editing layout
        editDashboardLayout({
          layoutData: JSON.stringify(layouts)
        }).then(() => {
          document.getElementById(`widget-drag-handle-${previousMovingWidget}`)?.focus();
        });
      }
    }
  }, [
    breakpointState,
    displayData,
    editDashboardLayout,
    isDisplayDataLoading,
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
