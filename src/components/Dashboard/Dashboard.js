/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */

import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Lodash imports for tree shaking
import orderBy from 'lodash/orderBy';
import isEqualWith from 'lodash/isEqualWith';

import { Responsive, WidthProvider } from 'react-grid-layout';

import {
  ConfirmationModal,
  Icon,
} from '@folio/stripes/components';

import { useWidgetLayouts } from '../../hooks';
import { ignoreArrayOrderEqualityFunc } from '../../utils';
import { COLUMNS, WIDGET_MARGIN } from '../../constants/dashboardConstants';

import NoWidgets from './NoWidgets';
import css from './Dashboard.css';
import { ErrorModal } from '../ErrorComponents';
import { Widget } from '../Widget';
import DashboardAccessInfo from '../DashboardAccessInfo';

const ReactGridLayout = WidthProvider(Responsive);

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
    displayData: dashboard.displayData,
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
    widgetMoveHandler,
    widgets
  ]);

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
          onResizeStop={(_l, _oi, _ni, _p, _e, _element) => {
            const newLayouts = {
              ...layouts,
              [breakpointState[0]]: _l
            };
            if (!isEqualWith(newLayouts, layouts, ignoreArrayOrderEqualityFunc)) {
              setLayouts(newLayouts);
            }
          }}
          /* Don't use onLayoutChange because we already set Layouts manually */
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

Dashboard.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayData: PropTypes.string
  }).isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
