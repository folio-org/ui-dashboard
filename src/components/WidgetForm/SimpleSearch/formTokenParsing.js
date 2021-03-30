/*
  This file contains functions to parse out incoming data
  in order to pass in as initialValues,
  as well as interpret incoming form data
  to deal with SimpleSearch specific tweaks
*/


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
      rules: tweakedRules,
      fieldType: fc.fieldType
    });
  });
  // Set the filter columns to be the new ones including tokens
  tweakedWidgetConf.filterColumns = tweakedFilterColumns;
  return tweakedWidgetConf;
};

// This must reflect any manipulations happening above
const widgetToInitialValues = (widget) => {
  const widgetConf = JSON.parse(widget.configuration);
  // We need to deal with tokens
  const { filterColumns } = widgetConf;

  const tweakedFilterColumns = filterColumns?.map(fc => {
    switch (fc.fieldType) {
      // For dates we build something of the form {{currentDate#23#w}}
      case 'Date': {
        // Check for date tokens in each rule
        const tweakedRules = [...fc.rules]?.map(fcr => {
          const tokenMatch = fcr.filterValue.match(/\{\{(.*)\}\}/)?.[1];
          if (!tokenMatch) {
            // This rule is non tokenised - set relativeOrAbsolute to 'absolute' and leave filterValue
            return ({
              ...fcr,
              relativeOrAbsolute: 'absolute'
            });
          }
          // At this point, we have a token, so we need to parse it out to work out the other fields
          const dateMatch = tokenMatch.match(/(currentDate)((#)(-?)(\d{1,3}))?((#)([d,w,m,y]))?/);
          return ({
            comparator: fcr.comparator,
            relativeOrAbsolute: 'relative',
            offsetMethod: dateMatch?.[4] ? 'subtract' : 'add',
            offset: dateMatch?.[5] || 0,
            timeUnit: dateMatch?.[8] || 'd',
          });
        });
        return ({
          ...fc,
          rules: tweakedRules
        });
      }
      case 'UUID': {
        // Check for currentUser tokens in each rule
        const tweakedRules = [...fc.rules]?.map(fcr => {
          const tokenMatch = fcr.filterValue.match(/\{\{(.*)\}\}/)?.[1];
          if (!tokenMatch) {
            // This rule is non tokenised - set relativeOrAbsolute to 'absolute' and leave filterValue
            return ({
              ...fcr,
              relativeOrAbsolute: 'absolute'
            });
          }
          // At this point, we have a token, no need to parse for currentUser
          return ({
            comparator: fcr.comparator,
            relativeOrAbsolute: 'relative'
          });
        });
        return ({
          ...fc,
          rules: tweakedRules
        });
      }
      default:
        // We don't use tokens for any other fields currently, so just pass fc as is
        return fc;
    }
  });

  // Set filterColumns to include token tweaks we just made
  widgetConf.filterColumns = tweakedFilterColumns;

  return {
    name: widget.name,
    definition: {
      id: widget.definition.id
    },
    ...widgetConf
  };
};

export {
  submitWithTokens,
  widgetToInitialValues
};
