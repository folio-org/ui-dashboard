import PropTypes from 'prop-types';
import classnames from 'classnames';

import { HasCommand, checkScope } from '@folio/stripes/components';

import { useWidgetDefinition } from '../../hooks';

import WidgetHeader from './WidgetHeader';
import css from './Widget.css';

const Widget = ({
  grabbed,
  onError,
  onWidgetDelete,
  onWidgetEdit,
  widget,
  widgetMoveHandler
}) => {
  const {
    specificWidgetDefinition: { definition: widgetDef, typeName },
    componentBundle: { WidgetComponent, FooterComponent },
  } = useWidgetDefinition(
    widget.definition?.name,
    widget.definition?.version
  );

  const shortcuts = [
    {
      name: 'edit',
      handler: () => onWidgetEdit(widget.id),
    }
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
    >
      <div
        className={
          classnames(
            css.widgetContainer,
            { [`${css.grabbed}`]: grabbed },
          )
        }
      >
        <div
          className={css.card}
        >
          <WidgetHeader
            key={`widget-header-${widget.id}`}
            grabbed={grabbed}
            name={widget.name}
            onWidgetDelete={onWidgetDelete}
            onWidgetEdit={onWidgetEdit}
            widgetId={widget.id}
            widgetMoveHandler={widgetMoveHandler}
          />
          <div
            key={`widget-body-${widget.id}`}
            className={css.body}
          >
            <WidgetComponent
              key={`${typeName}-${widget.id}`}
              onError={onError}
              widget={widget}
              widgetDef={widgetDef}
            />
          </div>
          <div className={css.footerContainer}>
            {FooterComponent &&
              <FooterComponent
                widget={widget}
                widgetDef={widgetDef}
              />
            }
          </div>
        </div>
      </div>
    </HasCommand>
  );
};

Widget.propTypes = {
  grabbed: PropTypes.bool,
  onError: PropTypes.func.isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widget: PropTypes.shape({
    definition: PropTypes.shape({
      name: PropTypes.string,
      version: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  widgetMoveHandler: PropTypes.func.isRequired
};

export default Widget;
