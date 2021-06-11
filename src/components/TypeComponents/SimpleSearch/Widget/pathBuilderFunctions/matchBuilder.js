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
  const matchStrings = [];
  if (matches) {
    const {
      term,
      matches: matchObject
    } = matches;

    // Ensure there is a term before continuing
    if (!term?.trim()) {
      return '';
    }

    for (const [key, value] of Object.entries(matchObject)) {
      // [key,value] should look like [agreementName, true] or [description, false]
      // Only act on match if configured and can find matchColumn in the definition
      const matchColumn = defMatchColumns.find(dmc => dmc.name === key);
      if (value && matchColumn) {
        matchStrings.push(`match=${matchColumn.accessPath}`);
      }
    }

    // Don't bother adding match if there are no match columns
    if (matchStrings.length) {
      matchStrings.push(`term=${encodeURI(term)}`);
    }
  }

  return matchStrings.filter(Boolean).join('&');
};

export default matchBuilder;

