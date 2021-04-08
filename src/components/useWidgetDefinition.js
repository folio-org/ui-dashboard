import React from 'react';
import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import getComponentsFromType from './getComponentsFromType';


/* Hook to expose the definition and consequently
 * the components relevant to that def's type
 * from the definition id
 */
const useWidgetDefinition = (defId) => {
  const ky = useOkapiKy();
  /*
   * Fetch specific widget definition data from its id
   */
  const { data: specificWidgetDefinition } = useQuery(
    // Ensure we get a fresh fetch per CREATE/EDIT with values.definition?.id
    ['ui-dashboard', 'useWidgetDefinition', 'getSpecificWidgetDef', defId],
    () => ky(`servint/widgets/definitions/${defId}`).json(),
    {
      /* Only run this query if the hook is passed a widgetDefinition */
      enabled: !!defId
    }
  );
  const componentBundle = getComponentsFromType(specificWidgetDefinition?.type?.name);
  return { specificWidgetDefinition, componentBundle };
};

export default useWidgetDefinition;
