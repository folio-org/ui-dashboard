import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import matches from 'dom-helpers/query/matches';

import { FormattedMessage, useIntl } from 'react-intl';

import { useForm, useFormState } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { AppIcon } from '@folio/stripes/core';
import {
  Button,
  Col,
  Headline,
  Icon,
  KeyValue,
  Layout,
  Pane,
  PaneFooter,
  Paneset,
  RadioButton,
  Row,
} from '@folio/stripes/components';

import DragAndDropFieldArray, { getHandles } from '../DragAndDropFieldArray';

import dndCSS from '../DragAndDropFieldArray/DragAndDropFieldArray.css';
import css from './ManageDashboardsForm.css';

const ManageDashboardsForm = ({
  onClose,
  onSubmit,
  pristine,
  submitting
}) => {
  const { change } = useForm();
  const { values } = useFormState();

  const intl = useIntl();

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

  const getDraggableDivStyle = (draggable) => {
    return (classNames(
      dndCSS.defaultDraggableBox,
      draggable.draggableProvided.draggableProps.style,
      { [dndCSS.pickedUp]: draggable.draggableSnapshot.isDragging }
    ));
  };


  // Get all handles elements using utility function provided by DragAndDropFieldArray
  const handles = getHandles();

  // By the same method as getHandles uses above, fetch all radio buttons we're rendering
  const radioButtons = Array.from(document.querySelectorAll('input[data-dash-radio=true]'))
    .filter((element) => {
      if (matches(element, '[data-focus-exclude]')) {
        return false;
      }

      return element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement;
    });

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
          <KeyValue
            label={<FormattedMessage id="ui-dashboard.userDashboards.dashboardOrder" />}
            value={
              <>
                <Layout className="padding-all-gutter">
                  <Row>
                    <Col xs={8} />
                    <Col
                      className={classNames(
                        css.colStyles,
                        css.colFlexCentre
                      )}
                      xs={2}
                    >
                      <Headline margin="none" size="medium">
                        <FormattedMessage id="ui-dashboard.accessLevel" />
                      </Headline>
                    </Col>
                    <Col
                      className={classNames(
                        css.colStyles,
                        css.colFlexCentre
                      )}
                      xs={2}
                    >
                      <Headline margin="none" size="medium">
                        <FormattedMessage id="ui-dashboard.default" />
                      </Headline>
                    </Col>
                  </Row>
                </Layout>
                <FieldArray
                  component={DragAndDropFieldArray}
                  draggableDivStyle={getDraggableDivStyle}
                  // Set up keyboard handler to ensure handles are tabbed through FIRST
                  getDragHandleProps={({ index }) => ({
                    onKeyDown: (e) => {
                      if (e.code === 'Tab' && e.shiftKey && index !== 0) {
                        e.preventDefault();
                        handles[index - 1].focus();
                      } else if (e.code === 'Tab' && !e.shiftKey && index !== (values?.dashboards?.length - 1)) {
                        e.preventDefault();
                        handles[index + 1].focus();
                      } else if (e.code === 'Tab' && index === (values?.dashboards?.length - 1)) {
                        e.preventDefault();
                        radioButtons[0].focus();
                      }
                    }
                  })}
                  name="dashboards"
                  renderHandle={({ index, item }) => (
                    <Icon
                      {...{
                        'aria-label': intl.formatMessage(
                          { id: 'ui-dashboard.userDashboards.dashboardOrder.dragAndDropHandleAria' },
                          { index: index + 1, dashboard: item?.dashboard?.name }
                        )
                      }}
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
                        <Col
                          className={classNames(
                            css.colStyles,
                            css.colFlexCentre
                          )}
                          xs={2}
                        >
                          <FormattedMessage id={`ui-dashboard.accessLevel.${item?.access?.value}`} />
                        </Col>
                        <Col
                          className={classNames(
                            css.colStyles,
                            css.colFlexCentre
                          )}
                          xs={2}
                        >
                          <RadioButton
                            checked={item?.defaultUserDashboard}
                            className={css.radioButton}
                            data-dash-radio
                            inline
                            onChange={() => {
                              fields.forEach(f => {
                                if (f !== fieldName) {
                                  change(`${f}.defaultUserDashboard`, false);
                                }
                              });
                              change(`${fieldName}.defaultUserDashboard`, true);
                            }}
                            // Set up key handler to ensure radio buttons are tabbed through separately to handles
                            onKeyDown={(e) => {
                              if (e.code === 'Tab' && e.shiftKey && index === 0) {
                                e.preventDefault();
                                handles[handles.length - 1].focus();
                              } else if (e.code === 'Tab' && e.shiftKey && index !== 0) {
                                e.preventDefault();
                                radioButtons[index - 1].focus();
                              } else if (e.code === 'Tab' && !e.shiftKey && index !== (values?.dashboards?.length - 1)) {
                                e.preventDefault();
                                radioButtons[index + 1].focus();
                              }
                            }}
                          />
                        </Col>
                      </Row>
                    );
                  }}
                </FieldArray>
              </>
            }
          />
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
