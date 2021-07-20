/*
 * This hook will take an error caught from a promise,
 * and attempt to parse it and retrieve any message, code, and stacktrace
 */

// Passing in the intl object isn't ideal,
// but this can't be a hook if it's going to run conditionally
const errorParser = async (err, intl) => {
  let errorMessage;
  let errBody;

  /* For HTTPError we assume error.response returns a Promise */
  if (err.name.toLowerCase() === 'httperror') {
    /*
     * Due to the nature of okapi endpoint calls, err.response
     * could comprise of JSON data OR string data. Read in as Blob
     * and deal with either case separately
     */
    const errBlob = await err.response?.blob();
    const errBlobText = await errBlob.text();

    if (errBlob.type === 'application/json') {
      const errJson = JSON.parse(errBlobText);
      errorMessage = intl.formatMessage(
        { id: 'ui-dashboard.httpError' },
        {
          errorCode: err.response?.status,
          errorText: `${err.response?.statusText}\n${errJson?.message}`
        }
      );
      errBody = errJson.stackTrace?.join('\n');
    } else {
      // Otherwise we've probably got a string, just display errBlobText as the stack
      errorMessage = intl.formatMessage(
        { id: 'ui-dashboard.httpError' },
        {
          errorCode: err.response?.status,
          errorText: err.response?.statusText
        }
      );
      errBody = errBlobText;
    }
  } else {
    errorMessage = err.name;
    errBody = err.message;
  }

  return ({
    errorMessage,
    errorStack: errBody
  });
};

export default errorParser;
