import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

import { getComponentsFromDefinition } from '../utils';

/* Hook to expose the definition and consequently
 * the components relevant to that def's type
 * from the definition id
 */
const useWidgetDefinition = (defName, defVersion = undefined) => {
  const ky = useOkapiKy();
  /*
   * Fetch specific widget definition data from its id
   */
  const { data: { 0: specificWidgetDefinition = {} } = [], isFetching = true } = useQuery(
    // Ensure we get a fresh fetch per definition
    ['ui-dashboard', 'useWidgetDefinition', 'getSpecificWidgetDef', defName, defVersion],
    () => ky(`servint/widgets/definitions/global?name=${defName}${defVersion ? '&version=' + defVersion : ''}`).json()
  );

  const componentBundle = getComponentsFromDefinition({
    definitionName: defName,
    isLoading: isFetching,
    selectedDefinition: specificWidgetDefinition,
  });
  return { specificWidgetDefinition, componentBundle };
};

export default useWidgetDefinition;
