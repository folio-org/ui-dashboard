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
    console.log("RC: %o", rc)
    console.log("DRC: %o", drc)
    
    const returnCol = { ...drc };
    if (rc.label) {
      returnCol.label = rc.label;
    }
    return returnCol;
  })

  
  const returnColumns = enrichedResultColumns.map(erc => { return { Header: erc.label, accessor: erc.accessPath }; });

  return returnColumns;
};

export default simpleSearchColumnParser;
