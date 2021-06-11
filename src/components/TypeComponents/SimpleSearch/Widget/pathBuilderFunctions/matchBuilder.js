/*
    matches will be an object of the form:
      {
        term: "abcde",
        matches: {
          <matchColName>: true,
          <matchColName>: false,
          <matchColName>: true,
          ...
        }
      }
      where each matchCol name comes from the widgetDefinition.
  */

const matchBuilder = (matches, defMatchColumns) => {
  let matchString = '';
  if (matches) {
    const {
      term,
      matches: matchObject
    } = matches;
    // Start building the matchString

    // Ensure there is a term before continuing
    if (term?.trim()) {
      for (const [key, value] of Object.entries(matchObject)) {
        // [key,value] should look like [agreementName, true] or [description, false]
        // Only act on match if configured
        if (value) {
          const matchColumn = defMatchColumns.find(dmc => dmc.name === key);
          // If we can't find the column in the def then ignore
          if (matchColumn) {
            matchString += `${matchString.length ? '&' : ''}match=${matchColumn.accessPath}`;
          }
        }
      }

      // Don't bother adding match if there are no match columns
      if (matchString.length) {
        matchString += `&term=${encodeURI(term)}`;
      }
    }
  }

  return matchString;
};

export default matchBuilder;

