import React, { useContext } from 'react';
import useWidget from '../../useWidget';
import WidgetContext from '../../widgetContext';
import { Widget } from '../Widget';

const ContextualWidget = ({ widget, widgetProps, widgetComponentProps }) => {
  const { WidgetProvider } = useWidget(widget.definition.type.name);

  const WidgetWithContext = () => {
    const { WidgetComponent } = useContext(WidgetContext);
    return (
      <Widget
        {...widgetProps}
      >
        <WidgetComponent {...widgetComponentProps} />
      </Widget>
    );
  };


  return (
    <WidgetProvider>
      <WidgetWithContext />
    </WidgetProvider>
  );
};

export default ContextualWidget;
