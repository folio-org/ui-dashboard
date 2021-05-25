import React from 'react';
import { Link } from 'react-router-dom';

import { FormattedUTCDate, Icon, NoValue } from '@folio/stripes/components';

import Registry from '../../../../Registry'

/*
  Takes in a simpleSearch result->column shape
  and returns a default renderFunction for that shape, of the form
  (entireRecord) => instructions_to_render_specific_field
*/
const getDefaultRenderFunction = ({ accessPath, name: drcName, valueType }, resource) => {
  // First attempt to get Registry render function
  const regFunc = Registry.getRenderFunction(resource, drcName);
  if (regFunc) {
    return regFunc;
  }

  // If that does not exist, create default render function
  if (accessPath && valueType) {
    console.log(`accessPath: ${accessPath}, valueType: ${valueType}`)
    switch (valueType.toLowerCase()) {
      case 'date': {
        return (data) => {
          const date = data[accessPath];
          return date ? <FormattedUTCDate value={date} /> :
          <NoValue />;
        };
      }
      case 'boolean': {
        return (data) => {
          const bool = data[accessPath];
          return bool ? <Icon icon="check-circle" /> :
          <Icon icon="times-circle" />;
        };
      }
      case 'link': {
        return (data) => {
          const linkText = data[accessPath];
          const viewTemplate = Registry.getResource(resource)?.getViewTemplate()
          console.log(`ViewTemplate for ${resource}: ${viewTemplate}`)
          
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
      default: {
        return (data) => data[accessPath];
      }
    }
  } else {
    // No accessPath, just return full data as string (Will probably show as "[Object object]")
    return (data) => data.toString();
  }

};

export default getDefaultRenderFunction;
