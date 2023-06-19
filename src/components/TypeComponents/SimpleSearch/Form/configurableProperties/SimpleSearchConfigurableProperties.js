import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import {
  TextField
} from '@folio/stripes/components';

import { validateURL } from '../../../utilities';

const SimpleSearchConfigurableProperties = ({
  configurableProperties: {
    urlLink = {}
  } = {}
}) => {
  return (
    <>
      {(urlLink.configurable || urlLink.defValue) &&
        // If urlLink is non configurable and has no defValue then we don't need it on the form
        <Field
          name="configurableProperties.urlLink"
          validate={validateURL}
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
