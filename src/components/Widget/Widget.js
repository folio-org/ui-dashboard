import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { HasCommand, checkScope } from '@folio/stripes/components';

import WidgetHeader from './WidgetHeader';

import css from './Widget.css';

const Widget = ({
  children,
  footerComponent: FooterComponent,
  grabbed,
  onWidgetDelete,
  onWidgetEdit,
  widget,
  widgetDef,
  widgetMoveHandler
}) => {
  const shortcuts = [
    {
      name: 'edit',
      handler: () => onWidgetEdit(widget.id),
    }
  ];
  // FIXME we might need to pass the footer in separately
  // so we can ensure that always renders at bottom

  console.log("GRABBED? %o", grabbed, "For widgetID: %o", widget.id)
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
            {children}
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
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  onWidgetDelete: PropTypes.func.isRequired,
  onWidgetEdit: PropTypes.func.isRequired,
  widget: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  widgetMoveHandler: PropTypes.func.isRequired
};

export default Widget;
