import { get } from 'lodash';

const simpleSearchResultParser = (data, widgetDef, widgetConf) => {
  const { resultColumns } = widgetConf;
  const { resultColumns: defResultColumns } = widgetDef;
  // This again assumes that all of the result columns in the widgetinstance are coming from the widgetDef.
  // If they're not there it'll cause issues.

  // First combine the configured result column data with the widgetdef result column data
  const enrichedResultColumns = resultColumns.map(rc => {
    const drc = defResultColumns.find(c => c.name === rc.column)
    const returnCol = {...drc}
    if(rc.label) {
      returnCol.label = rc.label
    }
    return returnCol;
  });

  // Then use those to reduce the incoming data to just display what's needed
  const returnData = data.map(d => {
    const returnDatum = {}
    enrichedResultColumns.forEach(erc => {
      const result = get(d, erc.accessPath)
      returnDatum[erc.name] = {
        value: result,
        label: erc.label
      }
    });
    return (
      returnDatum
    );
  })
  return (returnData);
}

export default simpleSearchResultParser