const submitWithTokens = (widgetConf) => {
  const tweakedWidgetConf = { ...widgetConf };
  // Remove tokens, for each filterColumn map the existing rules onto a comparator/value pair
  const tweakedFilterColumns = tweakedWidgetConf.filterColumns?.map(fc => {
    const tweakedRules = [...fc.rules]?.map(fcr => {
      if (fcr.relativeOrAbsolute === 'relative') {
        // We have a token, adapt the output value
        let outputValue = '';
        switch (fc.fieldType) {
          // For dates we build something of the form {{currentDate#23#w}}
          case 'Date':
            outputValue += '{{currentDate';
            if (fcr.offset && fcr.offset !== '0') {
              // Can be minus, default is positive
              outputValue += `#${fcr.offsetMethod === 'subtract' ? '-' : ''}${fcr.offset}`;
              if (fcr.timeUnit) {
                outputValue += `#${fcr.timeUnit}`;
              }
            }
            outputValue += '}}';
            break;
          case 'UUID':
            outputValue = '{{currentUser}}';
            break;
          default:
            // Unknown, try to pass an existing filterValue
            outputValue = fcr.filterValue;
            break;
        }
        return ({
          comparator: fcr.comparator,
          filterValue: outputValue
        });
      }
      // This isn't a token, escape
      return fcr;
    });
    return ({
      name: fc.name,
      rules: tweakedRules
    });
  });
  // Set the filter columns to be the new ones including tokens
  tweakedWidgetConf.filterColumns = tweakedFilterColumns;
  return tweakedWidgetConf;
};

export default submitWithTokens;
