import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

// We use an embedded form to handle the reinitialisation of the dynamic part of the form when initialValues change
const InnerWidgetForm = ({
  data: {
    initialValues,
    isEdit,
    specificWidgetDefinition,
    WidgetFormComponent
  } = {},
  handlers: {
    onSubmit,
    setWidgetConfigvalues
  }
}) => {
  return (
    <Form
      initialValues={initialValues}
      mutators={arrayMutators}
      navigationCheck
      onSubmit={onSubmit}
      render={({ form: { getState } }) => {
        const { values } = getState();
        setWidgetConfigvalues(values);

        return (
          /* Get specific form component for the selected widgetDefinition */
          <WidgetFormComponent
            isEdit={isEdit}
            specificWidgetDefinition={specificWidgetDefinition}
          />
        );
      }}
      subscription={{ values: true }}
    />
  );
};

InnerWidgetForm.propTypes = {
  data: PropTypes.shape({
    initialValues: PropTypes.object,
    isEdit: PropTypes.bool,
    specificWidgetDefinition: PropTypes.object
  }),
  handlers: PropTypes.shape({
    onSubmit: PropTypes.func,
    setWidgetConfigvalues: PropTypes.func
  })
};

export default InnerWidgetForm;
