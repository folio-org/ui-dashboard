import React from 'react';
import Registry from '@folio/plugin-resource-registry';

import getDefaultRenderFunction from './getDefaultRenderFunction';
/*
  Takes in the fetched data, and returns an object of the shape:
  [
    {
      Header: "Name",
      accessor: "show.name",
    },
    {
      Header: "Type",
      accessor: "show.type",
    },
    {
      Header: "Language",
      accessor: "show.language",
    },
    {
      Header: "Last updated",
      accessor: "lastUpdated",
      Cell: dateRenderer
    }
  ]
*/

const capitaliseText = (str) => {
  if (!str) {
    return '';
  }
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

const simpleSearchColumnParser = ({
  widgetConf: {
    resultColumns = []
  } = {},
  widgetDef: {
    resource,
    results: {
      columns: defResultColumns = []
    } = {}
  } = {}
}) => {
  // This again assumes that all of the result columns in the widgetinstance are coming from the widgetDef.
  // If they're not there it'll cause issues.

  // First combine the configured result column data with the widgetdef result column data
  return resultColumns.map((rc, index) => {
    const drc = defResultColumns.find(c => c.name === rc.name);

    // Heirachy is overwritten col label -> definition column label -> definition column name (capitalised)
    const headerText = (rc.label || drc.label || capitaliseText(drc.name));
    const returnColumn = { Header: headerText, accessor: drc.accessPath, id: `${rc.name}-[${index}]` };

    // Add any custom column rendering in here
    // NOTE this is column-wide, not cell wide.
    // That would need to happen in the SimpleTable component.

    // Use registry to check if there is a custom render property for this value
    let render = Registry.getRenderFunction(resource, drc.name);
    if (!render) {
      // If not, use default renderFunction
      render = getDefaultRenderFunction(drc);
    }
    // Pass render function entire object, not just cell value
    returnColumn.Cell = ({ row: { original } }) => render(original);

    return returnColumn;
  });
};

export default simpleSearchColumnParser;
