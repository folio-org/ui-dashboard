import tokens from '../../../../../tokens';
import isComparatorSpecialCase from '../../../utilities';

/*
  filterColumns will be an array of the form:
  [
    {
      name: "agreementStatus",
      rules: [
        {
          comparator: "==",
          filterValue: "active"
        },
        {
          comparator: "==",
          filterValue: "closed"
        }
      ]
    },
    {
      name: "startDate",
      rules: [
        {
          comparator: ">",
          filterValue: "2012-02-01"
        }
      ]
    },
    {
      name: "startDate",
      rules: [
        {
          comparator: "<",
          filterValue: "2021-02-22"
        }
      ]
    }
  ]
  We need to AND the top level filters, and OR the second level rules
*/
const filterBuilder = (filterColumns, defFilterColumns, stripes) => {
  let filterString = '';
  if (filterColumns) {
    // Begin each filter with & unless it's the first one
    filterColumns.forEach((f, index) => {
      let specificFilterString = '';
      if (index !== 0) {
        specificFilterString = '&filters=';
      } else {
        specificFilterString = 'filters=';
      }

      // This assumes that if a filterColumn exists then that column will always be in the widgetDef
      // We need to implement some kind of auto-schema check on the backend to support this
      const filterPath = (defFilterColumns.find(fc => fc.name === f.name))?.filterPath;

      // Then take each of the rules within the filter, and OR them together with the correct comparators
      const { rules } = f;
      rules.forEach((r, ind) => {
        if (isComparatorSpecialCase(r.comparator)) {
          // If we're allowing null the filterString is slightly different
          specificFilterString += `${filterPath}%20${r.comparator}`;
        } else {
          // Ensure we're safely encoding all special characters into the filters path, after applying tokens
          const encodedFilterValue = encodeURI(tokens(r.filterValue, stripes));
          specificFilterString += `${filterPath}${r.comparator ?? '=='}${encodedFilterValue}`;
        }
        if (ind !== rules.length - 1) {
          // This doesn't work as "||", it needs encoded value
          specificFilterString += '%7C%7C';
        }
      });
      filterString += specificFilterString;
    });
  }
  return filterString;
};

export default filterBuilder;
