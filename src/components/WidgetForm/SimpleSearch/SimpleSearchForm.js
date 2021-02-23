import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import SimpleSearchFilterArray from './filters/SimpleSearchFilterArray';

const SimpleSearchForm = ({
  specificWidgetDefinition
}) => {
  const {
    filters: {
      columns: filterColumns = []
    } = {}
  } = JSON.parse(specificWidgetDefinition?.definition);

  return (
    <>
      <FieldArray
        addButtonId="simple-search-form-add-filter-button"
        addButtonTooltipId="ui-dashboard.simpleSearchForm.filters.addFilterTooltip"
        addLabelId="ui-dashboard.simpleSearchForm.filters.addFilter"
        component={SimpleSearchFilterArray}
        data={{
          filterColumns
        }}
        deleteButtonTooltipId="ui-dashboard.simpleSearchForm.filters.removeFilter"
        disabled={false}
        headerId="ui-dashboard.simpleSearchForm.filters"
        id="simple-search-form-filters"
        name="filterColumns"
      />
    </>
  );
};

SimpleSearchForm.propTypes = {
  specificWidgetDefinition: PropTypes.object
};

export default SimpleSearchForm;
