/*
 * This component is called "Dashboard" but in reality is only the widget container
 */
import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useParams } from 'react-router-dom';

// Lodash imports for tree shaking
import orderBy from 'lodash/orderBy';
import isEqualWith from 'lodash/isEqualWith';

import { Responsive, WidthProvider } from 'react-grid-layout';

import {
  Icon,
  Loading,
} from '@folio/stripes/components';

import { useDashboardAccess, useWidgetLayouts } from '../../hooks';
import { ignoreArrayOrderEqualityFunc } from '../../utils';
import { COLUMNS, WIDGET_MARGIN } from '../../constants/dashboardConstants';

import css from './Dashboard.css';
import { Widget } from '../Widget';

const ReactGridLayout = WidthProvider(Responsive);

const Dashboard = ({
  handleError,
  onWidgetEdit,
  setupConfirmationModal,
  widgets
}) => {
  const { dashId } = useParams();
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  // Farm out a large chunk of work to a separate hook to keep this component cleaner
  // Easier to come here for render issues and go to hook for functionality issues
  const {
    breakpointState,
    layouts,
    movingWidget,
    setBreakpointState,
    setMovingWidget,
    setLayouts,
    widgetMoveHandler
  } = useWidgetLayouts({
    widgets
  });

  const widgetArray = useMemo(() => orderBy(
    // Order widgets by y then x so tab order always makes sense
    widgets,
    [
      w => layouts?.[breakpointState[0]]?.find(lw => lw.i === w.id)?.y,
      w => layouts?.[breakpointState[0]]?.find(lw => lw.i === w.id)?.x
    ]
  ).map((w, _i) => (
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
  )), [
    breakpointState,
    handleError,
    layouts,
    movingWidget,
    onWidgetEdit,
    setupConfirmationModal,
    widgetMoveHandler,
    widgets
  ]);

  if (!layouts) {
    return (
      <Loading />
    );
  }

  return (
    <ReactGridLayout
      breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      className="layout"
      cols={COLUMNS}
      draggableHandle=".widget-drag-handle" // This should not render if no perms
      layouts={layouts}
      margin={[WIDGET_MARGIN, WIDGET_MARGIN]}
      onBreakpointChange={(...bps) => {
        // Keep track of current breakpoint state
        setBreakpointState(bps);
      }}
      onDrag={(_l, _oi, _ni, _p, _e, element) => {
        setMovingWidget(element.id);
      }}
      onDragStop={(_l, _oi, _ni, _p, _e, _element) => {
        const newLayouts = {
          ...layouts,
          [breakpointState[0]]: _l
        };
        if (!isEqualWith(newLayouts, layouts, ignoreArrayOrderEqualityFunc)) {
          setLayouts(newLayouts);
        }

        setMovingWidget();
      }}
      onResizeStart={(_l, _oi, _ni, _p, _e, element) => {
        // Assumes that the parent is the drag and drop item -- seems flaky but works for now
        setMovingWidget(element.parentElement.id);
      }}
      onResizeStop={(_l, _oi, _ni, _p, _e, _element) => {
        const newLayouts = {
          ...layouts,
          [breakpointState[0]]: _l
        };
        if (!isEqualWith(newLayouts, layouts, ignoreArrayOrderEqualityFunc)) {
          setLayouts(newLayouts);
        }
        setMovingWidget();
      }}
      /* Don't use onLayoutChange because we already set Layouts manually */
      resizeHandle={(hasAccess('edit') || hasAdminPerm) ?
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
        </div> : null
      }
      rowHeight={30}
      useCSSTransforms={false}
    >
      {widgetArray}
    </ReactGridLayout>
  );
};

export default Dashboard;

Dashboard.propTypes = {
  handleError: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  setupConfirmationModal: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
