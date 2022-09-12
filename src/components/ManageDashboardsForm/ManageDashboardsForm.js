import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { AppIcon } from '@folio/stripes/core';
import {
  Button,
  Col,
  Icon,
  Layout,
  Pane,
  PaneFooter,
  Paneset,
  Row
} from '@folio/stripes/components';

import DragAndDropFieldArray from '../DragAndDropFieldArray';

import dndCSS from '../DragAndDropFieldArray/DragAndDropFieldArray.css';
import css from './ManageDashboardsForm.css';

const ManageDashboardsForm = ({
  dashboards,
  onClose,
  onSubmit,
  pristine,
  submitting
}) => {
  const { change } = useForm();
  const { values } = useFormState();

  // Keep weights up to date with list index in form
  useEffect(() => {
    if (values?.dashboards) {
      values.dashboards.forEach((wi, index) => {
        if (wi.weight !== index) {
          change(`dashboards[${index}].userDashboardWeight`, index);
        }
      });
    }
  }, [values, change]);

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-reorder-dashboard"
            marginBottom0
            onClick={onSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={onClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
      />
    );
  };

  console.log('DASHBOARDS: %o', dashboards)

  const getDraggableDivStyle = (draggable) => {
    return (classNames(
      dndCSS.defaultDraggableBox,
      draggable.draggableProvided.draggableProps.style,
      { [dndCSS.pickedUp]: draggable.draggableSnapshot.isDragging }
    ));
  };

  return (
    <Paneset>
      <Pane
        appIcon={<AppIcon app="dashboard" />}
        centerContent
        defaultWidth="100%"
        dismissible
        footer={renderPaneFooter()}
        id="pane-reorder-form"
        onClose={onClose}
        paneTitle={<FormattedMessage id="ui-dashboard.reorderWidgets" />}
      >
        <Layout className="marginTopHalf">
          <FieldArray
            component={DragAndDropFieldArray}
            draggableDivStyle={getDraggableDivStyle}
            name="dashboards"
            renderHandle={({ name, index }) => (
              <Icon
                //ariaLabel={
                //  intl.formatMessage(
                //    { id: 'ui-dashboard.dashboard.reorderForm.dragAndDropHandleAria' },
                //    { index: index + 1, widgetName: widgetNameFromName(name) }
                //  )
                //}
                icon="drag-drop"
              />
            )}
          >
            {({ name: fieldName, index, item, fields }) => {
              return (
                <Row key={`dashboard-order-array-${fieldName}`}>
                  <Col className={css.colStyles} xs={8}>
                    {/* Render dash name + desc */}
                    <strong>
                      {item?.dashboard?.name}
                    </strong>
                    {item?.dashboard?.description ? 
                      `: ${item?.dashboard?.description}` :
                      null
                    }
                  </Col>
                  <Col className={css.colStyles} xs={2}>
                    {item?.access?.label ?? item?.access?.value}
                  </Col>
                  <Col xs={2}>
                    DEFAULT STUFF GOES HERE
                  </Col>
                </Row>
              );
            }}
          </FieldArray>
        </Layout>
      </Pane>
    </Paneset>
  );
};

ManageDashboardsForm.propTypes = {
  dashboard: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool
};

export default ManageDashboardsForm;
