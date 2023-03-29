import { FormattedMessage } from 'react-intl';

const validateURL = (value) => {
  if (value) {
    const whiteList = ['/', 'http://', 'https://'];
    if (!whiteList.some(pattern => value.startsWith(pattern))) {
      return <FormattedMessage id="ui-dashboard.simpleSearchForm.error.invalidURL" />;
    } else {
      // eslint-disable-next-line no-param-reassign
      value = encodeURI(value);
      console.log(value);
    }
  }
  return undefined;
};
export default validateURL;

