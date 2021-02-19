import React from 'react';
import PropTypes from 'prop-types';

import { FormattedUTCDate } from '@folio/stripes/components';
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

// Render dates in FOLIO standard
const dateRenderer = ({ cell: { value } }) => (
  <FormattedUTCDate value={value} />
);

dateRenderer.propTypes = {
  cell: PropTypes.object
};

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
  return resultColumns.map(rc => {
    const drc = defResultColumns.find(c => c.name === rc.name);

    // Heirachy is overwritten col label -> definition column label -> definition column name (capitalised)
    const headerText = (rc.label || drc.label || capitaliseText(drc.name));
    const returnColumn = { Header: headerText, accessor: drc.accessPath };

    // Add any custom column rendering in here
    // NOTE this is column-wide, not cell wide.
    // That would need to happen in the SimpleTable component.
    if (drc.valueType === 'Date') {
      returnColumn.Cell = dateRenderer;
    }

    return returnColumn;
  });
};

export default simpleSearchColumnParser;
