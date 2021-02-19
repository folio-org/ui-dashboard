/*
  Takes in the fetched data, and returns an object of the shape:
  [
    {
      Header: "Name",
      accessor: "show.name"
    },
    {
      Header: "Type",
      accessor: "show.type"
    },
    {
      Header: "Language",
      accessor: "show.language"
    },
    {
      Header: "Genre(s)",
      accessor: "show.genres"
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
    const returnCol = { ...drc };
    if (rc.label) {
      returnCol.label = rc.label;
    }
    return returnCol;
  }).map(erc => { return { Header: erc.label, accessor: erc.accessPath }; });

  return enrichedResultColumns;
};

export default simpleSearchColumnParser;
