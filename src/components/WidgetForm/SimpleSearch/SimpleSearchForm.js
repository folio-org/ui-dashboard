import React from 'react';
import PropTypes from 'prop-types';
import { Field, useFormState } from 'react-final-form';


import {
  TextField
} from '@folio/stripes/components';

const SimpleSearchForm = () => {
  const { values } = useFormState();

  console.log("SSF VALUES: %o", values)

  return (
    <>
      <p> Hello, this is a SimpleSearch form </p>
      <Field
        component={TextField}
        name="simplesearch.textfield"
      />
    </>
  );
}

export default SimpleSearchForm;