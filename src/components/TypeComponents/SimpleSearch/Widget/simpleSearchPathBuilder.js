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
  pathString += matchString;

  const filterString = filterBuilder(filterColumns, defFilterColumns, stripes);
  pathString += `${matchString.length ? '&' : ''}${filterString}`;

  const sortString = sortBuilder(sortColumn, defSortColumns);
  pathString += `${(matchString.length || filterString.length) ? '&' : ''}${sortString}`;

  // Add stats=true
  pathString += `${
    (
      matchString.length ||
      filterString.length ||
      sortString.length
    ) ?
      '&' :
      ''
  }stats=true`;

  if (numberOfRows) {
    // We can assume always & because stats will be present
    pathString += `&perPage=${numberOfRows}`;
  }

  return pathString;
};

export default simpleSearchPathBuilder;
