import isEqual from 'lodash/isEqual';
import isEqualWith from 'lodash/isEqualWith';

// An equality func for use with Lodash's isEqualWith, which will ignore array order
const ignoreArrayOrderEqualityFunc = (val1, val2) => {
  if (Array.isArray(val1) && Array.isArray(val2)) {
    const set1 = new Set(val1);
    const set2 = new Set(val2);
    return isEqualWith(set1, set2, ignoreArrayOrderEqualityFunc);
  }

  return isEqual(val1, val2);
};

export default ignoreArrayOrderEqualityFunc;
