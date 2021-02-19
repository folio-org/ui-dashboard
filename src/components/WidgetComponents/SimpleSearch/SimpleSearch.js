import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

import pathBuilder from './simpleSearchPathBuilder';
import columnParser from './simpleSearchColumnParser';

import SimpleTable from '../SimpleTable';
import { WidgetFooter } from '../Widget';

const SimpleSearch = ({
  widget
}) => {

  /*
   * IMPORTANT this code uses react-query.
   * At some point after Stripes' Iris release there is a possibility this will be removed in favour of SWR.
   * A decision has not been made either way yet, so for now I've gone with react-query.
   * Should that happen, the APIs seem quite similar so porting won't be too difficult.
   */

  // Simple state we can update to force component rerender
  const [refreshCount, setRefreshCount] = useState(0);

  // At some point these will be versioned, so we might need to switch up logic slightly based on type version
  const widgetDef = JSON.parse(widget.definition.definition);
  const widgetConf = JSON.parse(widget.configuration);
  const columns = columnParser({ widgetDef, widgetConf });

  const ky = useOkapiKy();
  const { data, dataUpdatedAt } = useQuery(
    ['simpleSearch', widget.id, refreshCount],
    () => ky(pathBuilder(widgetDef, widgetConf)).json()
  );
  
  const timestamp = dataUpdatedAt ? moment(dataUpdatedAt).format('hh:mm a') : '';
  
  return (
    <>
      <SimpleTable columns={columns} data={data?.results || []} />
      <WidgetFooter onRefresh={() => setRefreshCount(refreshCount + 1)} timestamp={timestamp} />
    </>
  );
};

export default SimpleSearch;

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
