import css from './WidgetBody.css';

// Ensure a particular widgetType renders a widgetBody and widgetFooter to get the right behaviour
const WidgetBody = ({ children }) => (
  <div className={css.bodyContainer}>
    {children}
  </div>
);

export default WidgetBody;
