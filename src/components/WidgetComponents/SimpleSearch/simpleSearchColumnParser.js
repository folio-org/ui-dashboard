/*
  Takes in the fetched data, and returns an object of the shape:
  [
    {
      Header: "Name",
      accessor: "show.name",
      dataType: "String"
    },
    {
      Header: "Type",
      accessor: "show.type",
      dataType: "String"
    },
    {
      Header: "Language",
      accessor: "show.language",
      dataType: "String"
    },
    {
      Header: "Last updated",
      accessor: "lastUpdated",
      dataType: "Date"
    }
  ]
*/

const capitaliseText = (str) => {
  if (!str){
    return ''
  }
  return `${str[0].toUpperCase()}${str.slice(1)}`
}

const simpleSearchColumnParser = ({
  widgetConf: {
    resultColumns = []
  } = {},
  widgetDef: {
    results: {
      columns: defResultColumns = []
    } = {}
  } = {}
}) => {
  // This again assumes that all of the result columns in the widgetinstance are coming from the widgetDef.
  // If they're not there it'll cause issues.

  // First combine the configured result column data with the widgetdef result column data
  const enrichedResultColumns = resultColumns.map(rc => {
    const drc = defResultColumns.find(c => c.name === rc.name);

    // Heirachy is overwritten col label -> definition column label -> definition column name (capitalised)
    const headerText = (rc.label || drc.label || capitaliseText(drc.name))
    return { Header: headerText, accessor: drc.accessPath, valueType: drc.valueType }
  })
  return enrichedResultColumns;
};

export default simpleSearchColumnParser;
