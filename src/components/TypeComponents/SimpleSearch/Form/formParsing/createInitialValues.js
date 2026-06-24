// This function sets up the initialValues for creation of a new Widget
const createInitialValues = (widgetDef) => {
  const { definition = {} } = widgetDef;
  const { resource, results = {} } = definition;
  const columns = results.columns ?? [];

  const defaultResultColumn =
    resource === 'entitlements'
      ? columns.find(({ name }) => name === 'parentAgreement') ?? columns[0]
      : columns[0];

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
      name: defaultResultColumn?.name,
      label: defaultResultColumn?.label ?? defaultResultColumn?.name,
    }],
    sortColumn: {
      name: definition.sort?.columns?.[0]?.name,
      sortType: definition.sort?.columns?.[0]?.sortTypes?.[0]
    }
  };
};

export default createInitialValues;
