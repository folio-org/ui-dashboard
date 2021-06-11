import matchBuilder from './pathBuilderFunctions/matchBuilder';
import filterBuilder from './pathBuilderFunctions/filterBuilder';
import sortBuilder from './pathBuilderFunctions/sortBuilder';

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

  const matchString = matchBuilder(matches, defMatchColumns);
  const filterString = filterBuilder(filterColumns, defFilterColumns, stripes);
  const sortString = sortBuilder(sortColumn, defSortColumns);

  let perPageString = '';
  if (numberOfRows) {
    perPageString = `perPage=${numberOfRows}`;
  }

  // Filter to non-empty strings, and join them together with '&'
  pathString += [
    matchString,
    filterString,
    sortString,
    'stats=true',
    perPageString
  ].filter(Boolean).join('&');

  return pathString;
};

export default simpleSearchPathBuilder;
