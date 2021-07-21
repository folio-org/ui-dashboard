/*
 * This hook will take an error caught from a promise,
 * and attempt to parse it and retrieve any message, code, and stacktrace
 */

// Passing in the intl object isn't ideal,
// but this can't be a hook if it's going to run conditionally
const errorParser = async (error, intl) => {
  let errorMessage;
  let errorBody;

  /* For HTTPError we assume error.response returns a Promise */
  if (error.name.toLowerCase() === 'httperror') {
    /*
     * Due to the nature of okapi endpoint calls, err.response
     * could comprise of JSON data OR string data. Read in as Blob
     * and deal with either case separately
     */
    const errorBlob = await error.response?.blob();
    const errorBlobText = await errorBlob.text();

    if (errorBlob.type === 'application/json') {
      const jsonError = JSON.parse(errorBlobText);
      errorMessage = intl.formatMessage(
        { id: 'ui-dashboard.httpError' },
        {
          errorCode: error.response?.status,
          errorText: `${error.response?.statusText}\n${jsonError?.message}`
        }
      );
      errorBody = jsonError.stackTrace?.join('\n');
    } else {
      // Otherwise we've probably got a string, just display errBlobText as the stack
      errorMessage = intl.formatMessage(
        { id: 'ui-dashboard.httpError' },
        {
          errorCode: error.response?.status,
          errorText: error.response?.statusText
        }
      );
      errorBody = errorBlobText;
    }
  } else {
    errorMessage = error.name;
    errorBody = error.message;
  }

  return ({
    errorMessage,
    errorStack: errorBody
  });
};

export default errorParser;
