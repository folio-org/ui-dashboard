import React from 'react';
import { stripesConnect } from '@folio/stripes/core';
import pathBuilder from './utils/simpleSearchPathBuilder';
import resultParser from './utils/simpleSearchResultParser';

const SimpleSearch = ({
  resources: {
    data: {
      records : data = []
    } = {}
  },
  widget
}) => {
  //At some point these will be versioned, so we might need to switch up logic slightly based on type version
  const widgetDef = JSON.parse(widget.definition.definition)
  const widgetConf = JSON.parse(widget.configuration)
  const displayData = resultParser(data, widgetDef, widgetConf)

  return (
    <div>
      {JSON.stringify(displayData, null, 2)}
    </div>
  );
}

export default stripesConnect(SimpleSearch);

SimpleSearch.manifest = Object.freeze({
  data: {
    type: 'okapi',
    path: (_p, _q, _r, _s, props) => {
      const widgetDef = JSON.parse(props.widget.definition.definition)
      const widgetConf = JSON.parse(props.widget.configuration)
      return pathBuilder(widgetDef, widgetConf);
    },
    shouldRefresh: () => true,
    throwErrors: false
  }
});