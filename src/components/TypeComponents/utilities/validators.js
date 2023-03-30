import { FormattedMessage } from 'react-intl';
import { Tooltip, IconButton } from '@folio/stripes/components';

const validateURL = (value) => {
  if (value) {
    const whiteList = ['/', 'http://', 'https://'];
    const blackList = /[<>"'\\{}|^[\]`%;?@=#!]/;
    if (!whiteList.some(pattern => value.startsWith(pattern)) || value.match(blackList)) {
      return (
        <><FormattedMessage id="ui-dashboard.simpleSearchForm.error.invalidURL" />
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
    } else {
      // eslint-disable-next-line no-param-reassign
      value = encodeURI(value);
    }
  }
  return undefined;
};
export default validateURL;

