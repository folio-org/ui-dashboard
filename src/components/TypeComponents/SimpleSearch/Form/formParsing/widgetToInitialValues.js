// This must reflect any manipulations happening in submitWithTokens
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

export default widgetToInitialValues;
