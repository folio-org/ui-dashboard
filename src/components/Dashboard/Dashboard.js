/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';

import { Responsive, WidthProvider } from 'react-grid-layout';

import {
  ConfirmationModal, Icon,
} from '@folio/stripes/components';

import NoWidgets from './NoWidgets';
import css from './Dashboard.css';
import { ErrorModal } from '../ErrorComponents';
import { Widget } from '../Widget';
import useWidgetDefinition from '../useWidgetDefinition';
import DashboardAccessInfo from '../DashboardAccessInfo';

const ReactGridLayout = WidthProvider(Responsive);

const WIDGET_MARGIN = 20;
const COLUMNS = { lg: 12, md: 8, sm: 4 };
const WIDGET_MINS = { x: 4, y: 5 };

const propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};

const Dashboard = ({
  dashboard,
  onWidgetDelete,
  onWidgetEdit,
  widgets
}) => {
  // Handle delete through a delete confirmation modal rather than directly
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

  // Keep track of which widget we're deleting--necessary because this is the dashboard level
  const [widgetToDelete, setWidgetToDelete] = useState({});

  // This stores the CANVAS-LEVEL error state, ready to display in the modal
  const [errorState, setErrorState] = useState({
    errorMessage: null,
    errorModalOpen: false,
    errorStack: null
  });

  // This takes an error and a stacktrace to pass to the modal, and opens it
  const handleError = useCallback((err, stack) => {
    setErrorState({
      ...errorState,
      errorMessage: err,
      errorModalOpen: true,
      errorStack: stack
    });
  }, [errorState]);

  const handleHideModal = () => {
    setErrorState({
      ...errorState,
      errorModalOpen: false
    });
  };

  const setupConfirmationModal = (widgetId, widgetName) => {
    // Hijack the onDelete function to show confirmation modal instead at this level
    setShowDeleteConfirmationModal(true);
    setWidgetToDelete({ name: widgetName, id: widgetId });
  };

  const [movingWidget, setMovingWidget] = useState();
  const [layouts, setLayouts] = useState({
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
  });

  // Assume large until proven otherwise
  const [breakpointState, setBreakpointState] = useState(['lg', COLUMNS.lg]);
  const moveWidget = useCallback((x, y) => {
    const newLayout = {
      ...layouts,
      [breakpointState[0]]: layouts?.[breakpointState[0]]?.map((layoutObj) => {
        if (layoutObj?.i !== movingWidget) {
          return layoutObj;
        }

        let newX = layoutObj.x + x;
        // Don't go off the left of screen
        if (newX > 0) {
          // Don't go too far to right
          if (newX + layoutObj.w > breakpointState[1]) {
            newX = layoutObj.x;
          }
        } else {
          newX = 0;
        }

        let newY = layoutObj.y + y;
        // Don't go off the top of screen
        if (newY <= 0) {
          newY = 0;
        }

        const newLayoutObj = {
          ...layoutObj,
          x: newX,
          y: newY,
        };

        return (newLayoutObj);
      })
    };

    setLayouts(newLayout);
  }, [breakpointState, layouts, movingWidget]);

  console.log("LAYOUTS: %o", layouts)


  const widgetMoveHandler = useCallback((e, widgetId) => {
    if (movingWidget !== widgetId) {
      // Embdedded if here so we can ignore this logic in each case of the switch below
      if (e.code === 'Space') {
        // Prevent screen jumping to bottom
        e.preventDefault();
        // Set as the current moving widget
        setMovingWidget(widgetId);
      }
    } else {
      switch (e.code) {
        case 'Space':
          // Prevent screen jumping to bottom
          e.preventDefault();
          setMovingWidget();
          break;
        case 'Tab':
          // Lock Tab when grabbed
          e.preventDefault();
          break;
        case 'ArrowRight':
          moveWidget(1, 0);
          break;
        case 'ArrowLeft':
          moveWidget(-1, 0);
          break;
        case 'ArrowUp':
          moveWidget(0, -5);
          break;
        case 'ArrowDown':
          moveWidget(0, 5);
          break;
        default:
          break;
      }
    }
  }, [movingWidget, moveWidget]);

  const widgetArray = useMemo(() => widgets.map((w, i) => (
    <div
      key={w.id}
      id={w.id}
    >
      <Widget
        grabbed={movingWidget === w.id}
        onError={handleError}
        onWidgetDelete={setupConfirmationModal}
        onWidgetEdit={onWidgetEdit}
        widget={w}
        widgetMoveHandler={widgetMoveHandler}
      />
    </div>
  )), [handleError, movingWidget, onWidgetEdit, widgetMoveHandler, widgets]);

  const dashboardContents = () => {
    if (!widgets?.length) {
      return (
        <>
          <DashboardAccessInfo dashId={dashboard.id} />
          <NoWidgets />
        </>
      );
    }

    return (
      <>
        <DashboardAccessInfo dashId={dashboard.id} />
        <ReactGridLayout
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          className="layout"
          cols={COLUMNS}
          draggableHandle=".widget-drag-handle"
          isBounded
          layouts={layouts}
          margin={[WIDGET_MARGIN, WIDGET_MARGIN]}
          onBreakpointChange={(...bps) => {
            // Keep track of current breakpoint state
            setBreakpointState(bps);
          }}
          onDrag={(_l, _oi, _ni, _p, _e, element) => {
            setMovingWidget(element.id);
          }}
          onDragStop={() => {
            setMovingWidget();
          }}
          onLayoutChange={(_ly, lys) => {
            setLayouts(lys);
          }}
          resizeHandle={
            <div
              className="react-resizable-handle"
              style={{
                display: 'flex',
                position:'absolute',
                bottom: 0,
                right: 0,
                cursor: 'se-resize',
                padding: '5px'
              }}
              styles={{
                height: '100%'
              }}
            >
              <Icon
                icon="caret-down"
                // TODO this is clearly not ideal, we should add a corner icon
                iconClassName={css.rotate}
              />
            </div>
          }
          rowHeight={30}
          useCSSTransforms={false}
        >
          {widgetArray}
        </ReactGridLayout>
      </>
    );
  };

  return (
    <>
      <div className={css.dashboardContent}>
        {dashboardContents()}
      </div>
      <ConfirmationModal
        buttonStyle="danger"
        confirmLabel={<FormattedMessage id="ui-dashboard.delete" />}
        data-test-delete-confirmation-modal
        heading={<FormattedMessage id="ui-dashboard.dashboard.deleteWidget" />}
        id="delete-agreement-confirmation"
        message={
          <FormattedMessage
            id="ui-dashboard.dashboard.deleteWidgetConfirmMessage"
            values={{ name: widgetToDelete.name }}
          />
        }
        onCancel={() => {
          setShowDeleteConfirmationModal(false);
          setWidgetToDelete({});
        }}
        onConfirm={() => {
          onWidgetDelete(widgetToDelete.id);
          setShowDeleteConfirmationModal(false);
          setWidgetToDelete({});
        }}
        open={showDeleteConfirmationModal}
      />
      <ErrorModal
        handlers={{
          onHideModal: handleHideModal
        }}
        message={errorState.errorMessage}
        modalOpen={errorState.errorModalOpen}
        stack={errorState.errorStack}
      />
    </>
  );
};

export default Dashboard;
Dashboard.propTypes = propTypes;
