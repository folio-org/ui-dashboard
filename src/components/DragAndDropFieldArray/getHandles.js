import { matches } from 'dom-helpers';

const getHandles = (container = document) => {
  if (container.querySelectorAll) {
    const focusableSelector = 'div[data-handle=true]';

    return Array.from(container.querySelectorAll(focusableSelector))
      .filter((element) => {
        if (matches(element, '[data-focus-exclude]')) {
          return false;
        }

        // check for visibility while always include the current activeElement
        return element.offsetWidth > 0 ||
        element.offsetHeight > 0 ||
        element === document.activeElement;
      });
  }
  return [];
};

export default getHandles;
