import React from 'react';
import { get } from 'lodash';

import { FormattedUTCDate, Icon, NoValue } from '@folio/stripes/components';

/*
  Takes in a simpleSearch result->column shape
  and returns a default renderFunction for that shape, of the form
  (entireRecord) => instructions_to_render_specific_field
*/
const getDefaultRenderFunction = ({ accessPath, valueType }) => {
  if (accessPath) {
    switch (valueType.toLowerCase()) {
      case 'date': {
        const func = (data) => {
          const date = get(data, accessPath);
          return date ? <FormattedUTCDate value={date} /> :
          <NoValue />;
        };
        return func;
      }
      case 'boolean': {
        const func = (data) => {
          const bool = get(data, accessPath);
          return bool ? <Icon icon="check-circle" /> :
          <Icon icon="times-circle" />;
        };
        return func;
      }
      default: {
        return (data) => get(data, accessPath);
      }
    }
  } else {
    // No accessPath, just return full data as string (Will probably show as "[Object object]")
    return (data) => data.toString();
  }
};

export default getDefaultRenderFunction;
