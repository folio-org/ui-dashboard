import { groupBy } from 'lodash';

const simpleSearchPathBuilder = (widgetDef, widgetConf) => {
  // TODO add sort column support
  let { baseUrl } = widgetDef

  if (baseUrl.charAt(0) === "/") {
    // This allows the baseUrl to be defined as either "/erm/agreements" or "erm/agreements"
    baseUrl = baseUrl.substring(1);
  }

  const { filterColumns } = widgetConf

  // Start building the pathString with the baseUrl
  let pathString = `${baseUrl}`

  if (filterColumns) {
    const groupedFilters = groupBy(filterColumns, 'column')

    // Start building the filterString
    let filterString = "?"
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
    Object.keys(groupedFilters).forEach (f => {
      let specificFilterString = "filters="
      const filter = groupedFilters[f]
      // This assumes that if a filterColumn exists then that column will always be in the widgetDef
      // We need to implement some kind of auto-schema check on the backend to support this
      const filterPath = (widgetDef.filterColumns.find(fc => fc.name === f))?.filterPath
      filter.forEach ((sf, index) => {
        // TODO add support for other comparitors
        specificFilterString += `${filterPath}=${sf.filterValue}`
        if (index !== filter.length - 1) {
          specificFilterString += "||"
        }
      })
      filterString += specificFilterString;
    });
    pathString += filterString
  }
  return pathString;
}

export default simpleSearchPathBuilder