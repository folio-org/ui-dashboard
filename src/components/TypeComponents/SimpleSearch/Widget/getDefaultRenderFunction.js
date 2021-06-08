import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { FormattedDateTime } from '@folio/stripes-erm-components';
import { FormattedUTCDate, Icon, NoValue } from '@folio/stripes/components';

import Registry from '../../../../Registry';

/*
  Takes in a simpleSearch result->column shape
  and returns a default renderFunction for that shape, of the form
  (entireRecord) => instructions_to_render_specific_field
*/
const getDefaultRenderFunction = ({ accessPath, arrayDisplayPath, name, valueType }, resource) => {
  // First attempt to get Registry render function
  const regFunc = Registry.getRenderFunction(resource, name);
  if (regFunc) {
    return regFunc;
  }

  // If that does not exist, create default render function
  if (accessPath && valueType) {
    switch (valueType.toLowerCase()) {
      case 'date': {
        return (data) => {
          const date = get(data, accessPath);
          return date ? <FormattedUTCDate value={date} /> :
          <NoValue />;
        };
      }
      case 'datetime': {
        return (data) => {
          const date = get(data, accessPath);
          return date ? <FormattedDateTime date={date} /> :
          <NoValue />;
        };
      }
      case 'boolean': {
        return (data) => {
          const bool = get(data, accessPath);
          return bool ? <Icon icon="check-circle" /> :
          <Icon icon="times-circle" />;
        };
      }
      case 'link': {
        return (data) => {
          const linkText = get(data, accessPath);
          const viewTemplate = Registry.getResource(resource)?.getViewTemplate();
          if (!viewTemplate) {
            return linkText;
          }

          return (
            <Link
              to={viewTemplate(data)}
            >
              {linkText}
            </Link>
          );
        };
      }
      case 'array': {
        return (data) => {
          const array = get(data, accessPath);

          if (arrayDisplayPath) {
            return array.map(a => get(a, arrayDisplayPath)).join(', ');
          }
          return array.join(', ');
        };
      }
      default: {
        return (data) => get(data, accessPath) ?? null;
      }
    }
  } else {
    // No accessPath, just return full data as string (Will probably show as "[Object object]")
    return (data) => data.toString();
  }
};

export default getDefaultRenderFunction;
