/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */

import { forwardRef, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ConfirmationModal, Icon,
} from '@folio/stripes/components';

import NoWidgets from './NoWidgets';
import css from './Dashboard.css';
import { ErrorModal } from '../ErrorComponents';
import { Widget } from '../Widget';
import useWidgetDefinition from '../useWidgetDefinition';
import DashboardAccessInfo from '../DashboardAccessInfo';

import { Responsive, WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(Responsive);

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
  const handleError = (err, stack) => {
    setErrorState({
      ...errorState,
      errorMessage: err,
      errorModalOpen: true,
      errorStack: stack
    });
  };

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

  const widgetMoveHandler = useCallback((e, widgetId) => {
    console.log("E: %o", e);
    console.log("Current widget: %o", widgetId);
    console.log("Moving widget: %o", movingWidget);

    if (movingWidget !== widgetId) {
      console.log("NOT THE CURRENT MOVING WIDGET")
      // Embdedded if here so we can ignore this logic in each case of the switch below
      if (e.code === 'Space') {
        console.log("SET AS THE CURRENT MOVING WIDGET")
        setMovingWidget(widgetId);
      }
    } else {
      switch (e.code) {
        case 'Space':
          console.log("UNSET AS THE CURRENT MOVING WIDGET")
          setMovingWidget();
          break;
        case 'ArrowRight':
          alert("RIGHT ARROW CLICKED")
          break;
        default:
          break;
      }
    }
  }, [movingWidget]);


  /* const dashboardContents = () => {
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
        <div className={css.widgetsContainer}>
          {widgets.map(w => (
            <RenderWidget
              key={`widget-${w.id}`}
              widget={w}
            />
          ))}
        </div>
      </>
    );
  }; */

  const RenderWidget = ({ children, widget }) => {
    const {
      specificWidgetDefinition,
      componentBundle: { WidgetComponent, FooterComponent },
    } = useWidgetDefinition(
      widget.definition?.name,
      widget.definition?.version
    );

    return (
      <Widget
        footerComponent={FooterComponent}
        onWidgetDelete={setupConfirmationModal}
        onWidgetEdit={onWidgetEdit}
        widget={widget}
        widgetDef={specificWidgetDefinition?.definition}
        widgetMoveHandler={widgetMoveHandler}
      >
        <WidgetComponent
          key={`${specificWidgetDefinition?.typeName}-${widget.id}`}
          onError={handleError}
          widget={widget}
          widgetDef={specificWidgetDefinition?.definition}
        />
      </Widget>
    );
  };

  RenderWidget.propTypes = {
    widget: PropTypes.shape({
      definition: PropTypes.shape({
        name: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  };

  const widgetArray = useMemo(() => widgets.map((w, i) => (
    <div
      key={w.id}
      data-grid={{
        x: (i * 4) % 12,
        minH: 5,
        minW: 4,
        w: 4,
        y: 0,
        h: 5
      }}
    >
      <RenderWidget
        widget={w}
      />
    </div>
  )), [widgets]);

  const dashboardContents = () => {
    return (
      <ReactGridLayout
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        className="layout"
        cols={{ lg: 12, md: 8, sm: 4 }}
        draggableHandle=".widget-drag-handle"
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
      >
        {widgetArray}
      </ReactGridLayout>
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
