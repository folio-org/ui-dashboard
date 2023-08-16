import { useEffect, useState } from 'react';

/* A hook to debounce the window resizing event,
 * giving a single state which is "true"
 * _while_ a resize is in progress
 * With it only resetting to false
 * after 200ms have passed without a resize event
 */

const WINDOW_RESIZE_TIMEOUT = 200;
const useWindowResizing = () => {
  const [windowResizing, setWindowResizing] = useState(false);
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);

      setWindowResizing(true);

      timeout = setTimeout(() => {
        setWindowResizing(false);
      }, WINDOW_RESIZE_TIMEOUT);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowResizing;
};

export default useWindowResizing;
