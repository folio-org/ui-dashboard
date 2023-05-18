/*
 * This is a component which will hold the dashboard itself,
 * along with the actions menu and dashboard tab groups.
 * This will ALSO be used to render the actions menu for the "no dashboards" splash screen
 */

import { forwardRef, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  ConfirmationModal,
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

  const RenderWidget = ({ widget }) => {
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

  const resizeHandles = ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'];

/*   const layout = [
    { i: 'widget-d6b7c3ec-9754-43b1-9ecd-7807c46a3ca3', x: 0, y: 0, w: 1, h: 2, resizeHandles },
    { i: 'widget-cc5f4a6c-3f2e-4984-b4ba-9ed543846b73', x: 1, y: 1, w: 3, h: 2, resizeHandles },
    { i: 'widget-4154803c-1751-439b-a547-a35c069854d7', x: 4, y: 0, w: 1, h: 2, resizeHandles }
  ]; */

/*   const layout = widgets.map((w, i) => ({
    i: w.id,
    x: (i * 4) % 12,
    w: 4,
    y: 0,
    h: 1
  })); */

  //console.log("layout: %o", layout);

  const widgetArray = useMemo(() => widgets.map((w, i) => (
    <div
      key={w.id}
      data-grid={{
        x: (i * 4) % 12,
        minH: 10,
        minW: 4,
        w: 4,
        y: 0,
        h: 10
      }}
      style={{
        backgroundColor: 'grey',
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
        //layout={layout}
        resizeHandle={
          <span
            className="react-resizable-handle"
            style={{
              display: 'flex',
              position:'absolute',
              bottom: 0,
              right: 0,
              height: '20px',
              width: '20px',
              backgroundColor: 'orange'
            }}
            styles={{
              height: '100%'
            }}
          />
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
