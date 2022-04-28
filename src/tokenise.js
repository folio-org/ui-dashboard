
// This function will encode a token
const tokenise = (type, params = {}) => {
  let outputValue = '';

  const { offset, offsetSign, timeUnit } = params;
  switch (type.toLowerCase()) {
    case 'date':
      outputValue += '{{currentDate';

      if (offset && offset !== '0') {
        // Can be minus, default is positive
        outputValue += `#${offsetSign === 'subtract' ? '-' : ''}${offset}`;
        if (timeUnit) {
          outputValue += `#${timeUnit}`;
        }
      }
      outputValue += '}}';
      break;
    case 'user':
      outputValue = '{{currentUser}}';
      break;
    default:
      break;
  }

  return outputValue;
};


// This function will decode a token to an array containing type and params as above
const detokenise = (token) => {
  let type = '';
  const params = {};

  const tokenMatch = token?.toString()?.match(/\{\{(.*)\}\}/)?.[1];
  if (!tokenMatch) {
    return (
      ['noToken', {}]
    );
  }

  if (tokenMatch === 'currentUser') {
    type = 'user';
  } else {
    const dateMatch = tokenMatch.match(/(currentDate)((#)(-?)(\d{1,3}))?((#)([d,w,M,y]))?/);
    if (dateMatch?.[1] === 'currentDate') {
      type = 'date';
      if (dateMatch?.[5]) {
        // Grab the offset
        params.offset = parseInt(dateMatch[5], 10);

        if (dateMatch?.[4]) {
          params.offsetSign = 'subtract';
        } else {
          params.offsetSign = 'add';
        }

        if (dateMatch?.[8]) {
          // Add time unit
          params.timeUnit = dateMatch[8];
        }
      }
    }
  }

  return [type, params];
};

export {
  detokenise,
  tokenise
};
