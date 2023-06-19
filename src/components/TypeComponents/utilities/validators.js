import { FormattedMessage } from 'react-intl';
import isURL from 'validator/lib/isURL';

import { Tooltip, IconButton } from '@folio/stripes/components';

const validateURL = (value) => {
  if (value) {
    const protocolWhitelist = ['/', 'http://', 'https://'];

    // We do this because the entered URL can be a local page link starting with /
    const protocolMatch = protocolWhitelist.some(pattern => value.startsWith(pattern));

    /*
      If the page link DOES start with '/' we need to check it's a valid URL still,
      so fill in https://test.com as a filler baseUrl for validation.

      Use isURL from third party library validator to handle complicated regex checking
      of URLs to get rid of javascript attacks
    */
    const encoded = encodeURI(value);
    const parsed = new URL(encoded, 'http://test.com');

    if (!protocolMatch || !isURL(parsed.toString())) {
      return (
        <>
          <FormattedMessage id="ui-dashboard.simpleSearchForm.error.invalidURL" />
          <Tooltip
            id="tooltipValidateUrl"
            text={<FormattedMessage id="ui-dashboard.simpleSearchForm.error.invalidURL.tooltip" />}
          >
            {({ ref, ariaIds }) => (
              <IconButton
                ref={ref}
                aria-labelledby={ariaIds.text}
                icon="exclamation-circle"
              />
            )}
          </Tooltip>
        </>
      );
    }
    /* Have removed the logic which sets value to encodeURI here.
     * Instead we can encodeURI when reading from DB. Should NOT do both,
     * and in this direction we are protected from directly DB inserted URLs
     */
  }
  return undefined;
};
export default validateURL;

