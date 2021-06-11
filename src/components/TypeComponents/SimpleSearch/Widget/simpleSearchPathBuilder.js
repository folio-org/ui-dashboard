import tokens from '../../../../tokens';
import isComparatorSpecialCase from '../../utilities';

const simpleSearchPathBuilder = (widgetDef, widgetConf, stripes) => {
  const {
    baseUrl,
    filters: {
      columns: defFilterColumns = []
    } = {},
    matches: {
      columns: defMatchColumns = []
    } = {},
    sort: {
      columns: defSortColumns = [],
    } = {},
  } = widgetDef;

  // Start building the pathString with the baseUrl
  let pathString = baseUrl;
  if (baseUrl.charAt(0) === '/') {
    // This allows the baseUrl to be defined as either "/erm/agreements" or "erm/agreements"
    pathString = baseUrl.substring(1);
  }

  const {
    configurableProperties: {
      numberOfRows
    } = {},
    filterColumns,
    matches,
    sortColumn
  } = widgetConf;
  pathString += '?';

  /*
    matches will be an obvject of the form:
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

  if (matches) {
    const {
      term,
      matches: matchObject
    } = matches;
    // Start building the matchString
    let matchString = '';

    // Ensure there is a term before continuing
    if (term.trim()) {
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
        matchString += `&term=${term}`;
      }
    }
    pathString += matchString;
  }

  /*
      filterColumns will be an array of the form:
      [
        {
          name: "agreementStatus",
          rules: [
            {
              comparator: "==",
              filterValue: "active"
            },
            {
              comparator: "==",
              filterValue: "closed"
            }
          ]
        },
        {
          name: "startDate",
          rules: [
            {
              comparator: ">",
              filterValue: "2012-02-01"
            }
          ]
        },
        {
          name: "startDate",
          rules: [
            {
              comparator: "<",
              filterValue: "2021-02-22"
            }
          ]
        }
      ]
      We need to AND the top level filters, and OR the second level rules
    */

  if (filterColumns) {
    // Start building the filterString
    let filterString = '';
    if (matches) {
      filterString += '&';
    }

    // Begin each filter with & unless it's the first one
    filterColumns.forEach((f, index) => {
      let specificFilterString = '';
      if (index !== 0) {
        specificFilterString = '&filters=';
      } else {
        specificFilterString = 'filters=';
      }

      // This assumes that if a filterColumn exists then that column will always be in the widgetDef
      // We need to implement some kind of auto-schema check on the backend to support this
      const filterPath = (defFilterColumns.find(fc => fc.name === f.name))?.filterPath;

      // Then take each of the rules within the filter, and OR them together with the correct comparators
      const { rules } = f;
      rules.forEach((r, ind) => {
        if (isComparatorSpecialCase(r.comparator)) {
          // If we're allowing null the filterString is slightly different
          specificFilterString += `${filterPath}%20${r.comparator}`;
        } else {
          // Ensure we're safely encoding all special characters into the filters path, after applying tokens
          const encodedFilterValue = encodeURI(tokens(r.filterValue, stripes));
          specificFilterString += `${filterPath}${r.comparator ?? '=='}${encodedFilterValue}`;
        }
        if (ind !== rules.length - 1) {
          // This doesn't work as "||", it needs encoded value
          specificFilterString += '%7C%7C';
        }
      });
      filterString += specificFilterString;
    });
    pathString += filterString;
  }

  if (sortColumn) {
    // Start building the sortString
    let sortString = '';

    // Check we have something other than just sort
    if (pathString !== '?') {
      sortString += '&';
    }
    sortString += 'sort=';
    // At this point we should have either '&sort=' or 'sort='
    const sortPath = (defSortColumns.find(sc => sc.name === sortColumn.name))?.sortPath;
    sortString += `${sortPath};${sortColumn.sortType}`;

    pathString += sortString;
  }

  if (filterColumns || sortColumn) {
    pathString += '&stats=true';
  } else {
    pathString += 'stats=true';
  }

  if (numberOfRows) {
    // We can assume always & because stats will be present
    pathString += `&perPage=${numberOfRows}`;
  }

  return pathString;
};

export default simpleSearchPathBuilder;
