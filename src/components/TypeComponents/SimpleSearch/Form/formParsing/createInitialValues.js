// This function sets up the initialValues for creation of a new Widget
const createInitialValues = (widgetDef) => {
  const { definition = {} } = widgetDef;

  return {
    configurableProperties: {
      numberOfRows: definition.configurableProperties?.numberOfRows?.defValue,
      urlLink: definition.configurableProperties?.urlLink?.defValue,
    },
    matches: {
      term: definition.matches?.defaultTerm,
      matches: Object.fromEntries(definition.matches?.columns.map(col => ([col.name, col.default]))),
    },
    resultColumns: [{
      name: definition.results?.columns?.[0]?.name,
      label: definition.results?.columns?.[0]?.label ?? definition.results?.columns?.[0]?.name,
    }],
    sortColumn: {
      name: definition.sort?.columns?.[0]?.name,
      sortType: definition.sort?.columns?.[0]?.sortTypes?.[0]
    }
  };
};

export default createInitialValues;
