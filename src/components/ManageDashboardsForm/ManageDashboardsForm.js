import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage } from 'react-intl';

import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { AppIcon } from '@folio/stripes/core';
import {
  Button,
  Icon,
  Layout,
  Pane,
  PaneFooter,
  Paneset
} from '@folio/stripes/components';

import DragAndDropFieldArray from '../DragAndDropFieldArray';

import css from '../ReorderForm/ReorderForm.css';

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
      css.draggableBox,
      draggable.draggableProvided.draggableProps.style,
      { [css.pickedUp]: draggable.draggableSnapshot.isDragging }
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
            {({ item }) => {
              return item?.dashboard?.name;
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
