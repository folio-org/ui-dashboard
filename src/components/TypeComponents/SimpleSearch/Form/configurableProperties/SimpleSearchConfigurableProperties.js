import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';

import {
  TextField
} from '@folio/stripes/components';

const SimpleSearchConfigurableProperties = ({
  configurableProperties: {
    urlLink = {}
  } = {}
}) => {
  const { initialValues } = useFormState();
  const { change } = useForm();

  useEffect(() => {
    // If and when initialValues change, we have to reset those fields we set a default on
    if (initialValues?.configurableProperties?.urlLink) {
      /* Is there a better way to reset field to initialValue when that changes? */
      change('configurableProperties.urlLink', initialValues?.configurableProperties?.urlLink);
    }
  }, [change, initialValues]);

  return (
    <>
      { (urlLink.configurable || urlLink.defValue) &&
        // If urlLink is non configurable and has no defValue then we don't need it on the form
        <Field
          defaultValue={urlLink.defValue}
          name="configurableProperties.urlLink"
        >
          {({ ...fieldRenderProps }) => {
            if (urlLink.configurable) {
              return (
                <TextField
                  {...fieldRenderProps}
                  data-testid="simple-search-configurable-properties-url-link"
                  id="simple-search-configurable-properties-url-link"
                  label={<FormattedMessage id="ui-dashboard.simpleSearchForm.configurableProperties.urlLink" />}
                />
              );
            }
            // If the code gets here we know urlLink has a defValue but is non-configurable
            // So render null on the page and pass the defvalue in the field
            return null;
          }}
        </Field>
      }
    </>
  );
};

SimpleSearchConfigurableProperties.propTypes = {
  configurableProperties: PropTypes.shape({
    numberOfRows: PropTypes.object.isRequired
  }).isRequired
};

export default SimpleSearchConfigurableProperties;
