// This function can take `widgetDef` as a parameter if necessary
const createInitialValues = (widgetDef) => {
  const { definition = {} } = widgetDef;

  return {
    configurableProperties: {
      numberOfRows: definition.configurableProperties?.numberOfRows?.defValue,
      urlLink: definition.configurableProperties?.urlLink?.defValue,
    },
    sortColumn: {
      name: definition.sort?.columns?.[0]?.name,
      sortType: definition.sort?.columns?.[0]?.sortTypes?.[0]
    },
    resultColumns: [{
      name: definition.results?.columns?.[0]?.name,
      label: definition.results?.columns?.[0]?.label ?? definition.results?.columns?.[0]?.name,
    }]
  };
};

export default createInitialValues;
