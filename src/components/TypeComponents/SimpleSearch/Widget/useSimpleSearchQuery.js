import { useQuery } from 'react-query';

import { useOkapiKy, useStripes } from '@folio/stripes/core';

import pathBuilder from './simpleSearchPathBuilder';
import simpleSearchQueryKey from './simpleSearchQueryKey';

const useSimpleSearchQuery = ({
  widget,
  widgetDef,
  onCatch
}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();

  const widgetConf = JSON.parse(widget.configuration);

  const returnObj = useQuery(
    // If widget.configuration changes, this should refetch
    simpleSearchQueryKey(widget),
    () => ky(pathBuilder(widgetDef, widgetConf, stripes)).json()
      .catch(onCatch)
  );

  return returnObj;
};

export default useSimpleSearchQuery;
