// This is a file containing all the token logic

// TOKENS can take the form
// {{currentUser}} or
// {{currentDate}} {{currentDate#15}} {{currentDate#-10}} {{currentDate#3#w}}
// So currentDate, optionally +- up to 3 digits, then optionally a 'd', 'w', 'm' or 'y'

import moment from 'moment';

function tokens(valueString, stripes, options = {}) {
  const dateFormat = options.dateFormat || 'YYYY-MM-DD';

  const tokenMatch = valueString.match(/\{\{(.*)\}\}/)?.[1];

  // ZERO TOKEN MATCH
  if (!tokenMatch) {
    // If the valueString doesn't match anything then it's not a token, return value
    return valueString;
  }

  // MATCH CURRENT USER
  if (tokenMatch === 'currentUser') {
    return stripes.user.user.id;
  }

  // MATCH CURRENT DATE +- DAYS
  const dateMatch = tokenMatch.match(/(currentDate)((#)(-?\d{1,3}))?((#)([d,w,m,y]))?/);
  if (dateMatch?.[1] === 'currentDate') {
    // We have matched the date pattern, do date logic
    const currentDate = moment(new Date()).startOf('day');
    if (dateMatch?.[4]) {
      // We have an integer to add to date
      if (dateMatch?.[7]) {
        // Add days, months or years
        return currentDate.add(dateMatch?.[4], dateMatch?.[7]).format(dateFormat);
      }
      // Assume days if not
      return currentDate.add(dateMatch?.[4], 'd').format(dateFormat);
    }

    return currentDate.format(dateFormat);
  }

  // If all else fails, return an empty string
  return '';
}

export default tokens;
