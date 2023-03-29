import { FormattedMessage } from 'react-intl';

const validateURL = (value) => {
  if (value) {
    const whiteList = ['/', 'http://', 'https://'];
    const blackList = /[<>"'\\{}|^[\]`%;?@=#!]/;
    if (!whiteList.some(pattern => value.startsWith(pattern)) || value.match(blackList)) {
      return <FormattedMessage id="ui-dashboard.simpleSearchForm.error.invalidURL" />;
    } else {
      // eslint-disable-next-line no-param-reassign
      value = encodeURI(value);
    }
  }
  return undefined;
};
export default validateURL;

