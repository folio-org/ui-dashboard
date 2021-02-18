import React, { useMemo } from "react";
import PropTypes from 'prop-types';
import moment from 'moment';

import pathBuilder from './simpleSearchPathBuilder';
import columnParser from './simpleSearchColumnParser';

import SimpleTable from '../SimpleTable';
import { WidgetFooter } from '../Widget';

import { useStripes } from '@folio/stripes/core';

const DisconnectedSimpleSearch = ({
  resources: {
    simple_search_data: {
      loadedAt,
      records: {
        0: data = {}
      } = []
    } = {}
  },
  widget
}) => {
  const timestamp = loadedAt ? moment(loadedAt).format("hh:mm a") : '';
  // At some point these will be versioned, so we might need to switch up logic slightly based on type version
  const widgetDef = JSON.parse(widget.definition.definition);
  const widgetConf = JSON.parse(widget.configuration);
  const columns = useMemo(() => columnParser({ widgetDef, widgetConf }), [widgetDef, widgetConf]);

  return (
    <>
      <SimpleTable columns={columns} data={data?.results || []}/>
      <WidgetFooter timestamp={timestamp}/>
    </>
  );
};

// Do the connecting in here to avoid having hooks inside a switch in the Dashboard Component
const SimpleSearch = ({ widget }) => {
  const stripes = useStripes();
  const ConnectedSimpleSearch = useMemo(() => stripes.connect(DisconnectedSimpleSearch, {dataKey: widget.id}), [])
  return <ConnectedSimpleSearch widget={widget}/>;
}

export default SimpleSearch;

DisconnectedSimpleSearch.manifest = Object.freeze({
  simple_search_data: {
    type: 'okapi',
    path: (_p, _q, _r, _s, props) => {
      const widgetDef = JSON.parse(props.widget.definition.definition);
      const widgetConf = JSON.parse(props.widget.configuration);
      return pathBuilder(widgetDef, widgetConf);
    },
    shouldRefresh: () => false,
    throwErrors: false
  }
});

SimpleSearch.propTypes = {
  resources: PropTypes.shape({
    data: PropTypes.object
  }).isRequired,
  widget: PropTypes.shape({
    configuration: PropTypes.string.isRequired,
    definition: PropTypes.shape({
      definition: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
