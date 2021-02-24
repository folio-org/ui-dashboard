import React from 'react';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

const filterPresent = (value, allValues, meta) => {
  if (meta) {
    // Name is something like "filterColumns[3].name" and we want the "filterColumns" array
    const filterColumnCount = get(
      allValues,
      meta.name.substring(0, meta.name.lastIndexOf('[')), []
    ).map(fc => fc.name).reduce(
      (acc, cur) => {
        if (cur === value) {
          return acc + 1;
        }
        return acc;
      },
      0
    );
    if (filterColumnCount > 1) {
      return (
        <div data-test-error-multiple-open-ended>
          <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterAlreadyPresent" />
        </div>
      );
    }
  }

  return undefined;
};

export default {
  filterPresent
};
