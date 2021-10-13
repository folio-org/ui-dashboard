import React from 'react';
import PropTypes from 'prop-types';

// We use an embedded form to handle the reinitialisation of the dynamic part of the form when initialValues change
const InnerWidgetForm = ({
  data: {
    isEdit,
    specificWidgetDefinition,
    WidgetFormComponent
  } = {},
  form: { getState },
  handlers: {
    setWidgetConfigvalues
  }
}) => {
  const { values } = getState();
  setWidgetConfigvalues(values);

  return (
    /* Get specific form component for the selected widgetDefinition */
    <WidgetFormComponent
      isEdit={isEdit}
      specificWidgetDefinition={specificWidgetDefinition}
    />
  );
};

InnerWidgetForm.propTypes = {
  data: PropTypes.shape({
    initialValues: PropTypes.object,
    isEdit: PropTypes.bool,
    specificWidgetDefinition: PropTypes.object
  }),
  form: PropTypes.object,
  handlers: PropTypes.shape({
    onSubmit: PropTypes.func,
    setWidgetConfigvalues: PropTypes.func
  })
};

export default InnerWidgetForm;
