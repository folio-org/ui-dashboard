import { useCallback, useState } from 'react';
import { utils } from 'react-grid-layout';

// Lodash imports for tree shaking
import isEqual from 'lodash/isEqual';

// This hook controls the move handler for a widget (And accessibility)
// Note it does NOT send a PUT to the endpoint, that is handled above
const useMoveWidget = ({
  breakpointState,
  layouts,
  setLayouts
}) => {
  const [movingWidget, setMovingWidget] = useState();

  // See https://github.com/react-grid-layout/react-grid-layout/issues/1306
  const moveWidget = useCallback((eCode, eShift) => {
    const cl = utils.cloneLayout(layouts?.[breakpointState[0]]);
    const item = cl.find((widget) => widget.i === movingWidget);

    if (!item) {
      return;
    }

    if (eShift) {
      switch (eCode) {
        case 'ArrowRight':
          item.w += 1;
          break;
        case 'ArrowLeft':
          item.w += -1;
          break;
        case 'ArrowDown':
          item.h += 1;
          break;
        case 'ArrowUp':
          item.h += -1;
          break;
        default:
          item.w += 0;
          item.h += 0;
          break;
      }

      item.w = Math.min(
        Math.max(item.w, item.minW ?? 1),
        item.maxW ?? breakpointState[1],
      );

      item.h = Math.max(item.h, item.minH ?? 1);
      const newLayouts = {
        ...layouts,
        [breakpointState[0]]: cl
      };
      setLayouts(newLayouts);
    } else {
      const oldX = item.x;
      const oldY = item.y;

      // Iterate through trying to bump location until it works? -- Seems ugly
      for (let a = 1; a < 100; a++) {
        let newX = oldX;
        let newY = oldY;
        switch (eCode) {
          case 'ArrowRight':
            newX = oldX + a;
            break;
          case 'ArrowLeft':
            newX = oldX - a;
            break;
          case 'ArrowDown':
            newY = oldY + a;
            break;
          case 'ArrowUp':
            newY = oldY - a;
            break;
          default:
            break;
        }

        if (newY < 0 || newX < 0 || newX + item.w > breakpointState[1]) {
          break;
        }

        const nl = utils.compact(
          utils.moveElement(
            cl,
            item,
            newX,
            newY,
            true, // isUserAction
            false, // preventCollision
            'vertical',
            breakpointState[1],
            false, // No idea what this does
          ),
          'vertical',
          breakpointState[1],
        );

        // Only set layout if something has changed
        if (!isEqual(layouts?.[breakpointState[0]], nl)) {
          const newLayouts = {
            ...layouts,
            [breakpointState[0]]: cl
          };

          setLayouts(newLayouts);
          break;
        }
      }
    }
  }, [breakpointState, layouts, movingWidget, setLayouts]);

  const widgetMoveHandler = useCallback((e, widgetId) => {
    if (movingWidget !== widgetId) {
      // Embdedded if here so we can ignore this logic in each case of the switch below
      if (e.code === 'Space') {
        // Prevent screen jumping to bottom
        e.preventDefault();
        // Set as the current moving widget
        setMovingWidget(widgetId);
      }
    } else {
      switch (e.code) {
        case 'Space':
          // Prevent screen jumping to bottom
          e.preventDefault();
          setMovingWidget();
          break;
        case 'Tab':
          // Lock Tab when grabbed
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'ArrowDown': {
          e.preventDefault();
          moveWidget(e.code, e.shiftKey);
          break;
        }
        default:
          break;
      }
    }
  }, [movingWidget, moveWidget]);

  return ({
    movingWidget,
    setMovingWidget,
    widgetMoveHandler,
  });
};

export default useMoveWidget;
