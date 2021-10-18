// This must reflect any manipulations happening in submitWithTokens
// These components accept the widget, and the passed definition
const widgetToInitialValues = (widget, widgetDef) => {
  // We have an existing widget, parse it and creat initialValues
  const widgetConf = JSON.parse(widget.configuration);
  // We need to deal with tokens
  const { filterColumns } = widgetConf;
  const { definition } = widgetDef;

  const tweakedFilterColumns = filterColumns?.map(fc => {
    // Get the fieldType for the filterColumn from the definition
    const fieldType = definition?.filters?.columns?.find(col => col.name === fc.name)?.valueType;
    switch (fieldType) {
      // For dates we build something of the form {{currentDate#23#w}}
      case 'Date': {
        // Check for date tokens in each rule
        const tweakedRules = [...fc.rules]?.map(fcr => {
          const tokenMatch = fcr.filterValue.match(/\{\{(.*)\}\}/)?.[1];
          if (!tokenMatch) return fcr;
          // At this point, we have a token, so we need to parse it out to work out the other fields
          const dateMatch = tokenMatch.match(/(currentDate)((#)(-?)(\d{1,3}))?((#)([d,w,M,y]))?/);
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
          fieldType,
          rules: tweakedRules
        });
      }
      case 'UUID': {
        if (fc.resourceType === 'user') {
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
        } else {
          // We don't have tokens for UUID fields outside of 'user'
          return fc;
        }
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
    widgetConfig: widgetConf
  };
};

export default widgetToInitialValues;
