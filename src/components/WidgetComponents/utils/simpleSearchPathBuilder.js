import { groupBy } from 'lodash';

const simpleSearchPathBuilder = (widgetDef, widgetConf) => {
  // TODO add sort column support
  const {
    baseUrl,
    filters: {
      columns: defFilterColumns = []
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

  const { filterColumns, sortColumn: { 0: sortColumn } = [] } = widgetConf;
  pathString += '?';

  if (filterColumns) {
    const groupedFilters = groupBy(filterColumns, 'name');

    // Start building the filterString
    let filterString = '';
    /*
      This will return an object of the form:
      {
        vendor: [
          {
            column: "vendor",
            filterValue: "EBSCO"
          },
          {
            column: "vendor",
            filterValue: "AnotherVendor"
          }
        ],
        startDate: [
          {
            column: "startDate",
            filterValue: "2020-01-19"
            comparitor: "le"
          }
        ]
      }
    */
    Object.keys(groupedFilters).forEach((f, index) => {
      let specificFilterString = '';
      if (index !== 0) {
        specificFilterString = '&filters=';
      } else {
        specificFilterString = 'filters=';
      }

      const filter = groupedFilters[f];
      // This assumes that if a filterColumn exists then that column will always be in the widgetDef
      // We need to implement some kind of auto-schema check on the backend to support this
      const filterPath = (defFilterColumns.find(fc => fc.name === f))?.filterPath;

      filter.forEach((sf, ind) => {
        specificFilterString += `${filterPath}${sf.comparator}${sf.filterValue}`;
        if (ind !== filter.length - 1) {
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
    if (filterColumns) {
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


  return pathString;
};

export default simpleSearchPathBuilder;
