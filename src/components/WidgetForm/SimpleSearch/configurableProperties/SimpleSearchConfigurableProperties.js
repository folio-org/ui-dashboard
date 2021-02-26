import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import {
  TextField
} from '@folio/stripes/components';

const SimpleSearchConfigurableProperties = ({
  configurableProperties: {
    numberOfRows = {},
    urlLink = {}
  } = {}
}) => {

  return (
    <>
      <Field
        name="configurableProperties.numberOfRows"
        defaultValue={numberOfRows.defValue}
      >
        {({ input }) => {
          if (numberOfRows.configurable) {
            return (
              <TextField
                {...input}
                data-testid="simple-search-configurable-properties-number-of-rows"
                id="simple-search-configurable-properties-number-of-rows"
                label={<FormattedMessage id="ui-dashboard.simpleSearchForm.configurableProperties.numberOfRows" />}
              />
            );
          }
          // We know that if numberOfRows is non-configurable then it MUST have a defValue
          // We still want that to be submitted, but no field to render on the form
          return null;
        }}
      </Field>
      { (urlLink.configurable || urlLink.defValue) &&
        // If urlLink is non configurable and has no defValue then we don't need it on the form
        <Field
          name="configurableProperties.urlLink"
          defaultValue={urlLink.defValue}
        >
          {({ input }) => {
            if (urlLink.configurable) {
              return (
                <TextField
                  {...input}
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
}

export default SimpleSearchConfigurableProperties;