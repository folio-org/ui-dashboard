// These components accept the widget, and the passed definition
const widgetToInitialValues = (widget, _widgetDef) => {
  // We have an existing widget, parse it and create initialValues
  const widgetConf = JSON.parse(widget.configuration);

  // Insert any widget -> initialValues logic here

  return {
    name: widget.name,
    widgetConfig: widgetConf
  };
};

export default widgetToInitialValues;
