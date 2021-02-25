import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import SimpleSearchFilterArray from './filters/SimpleSearchFilterArray';
import SimpleSearchResultArray from './results/SimpleSearchResultArray';
import SimpleSearchSort from './sort/SimpleSearchSort';

const SimpleSearchForm = ({
  specificWidgetDefinition
}) => {
  const {
    filters: {
      columns: filterColumns = []
    } = {},
    results: {
      columns: resultColumns = []
    } = {},
    sort: {
      columns: sortColumns = []
    } = {}
  } = JSON.parse(specificWidgetDefinition?.definition);
  return (
    <>
      <FieldArray
        addButtonId="simple-search-form-add-filter-button"
        addLabelId="ui-dashboard.simpleSearchForm.filters.addFilter"
        component={SimpleSearchFilterArray}
        data={{
          filterColumns
        }}
        deleteButtonTooltipId="ui-dashboard.simpleSearchForm.filters.removeFilter"
        headerId="ui-dashboard.simpleSearchForm.filters"
        id="simple-search-form-filters"
        name="filterColumns"
      />
      <FieldArray
        addButtonId="simple-search-form-add-result-column-button"
        addLabelId="ui-dashboard.simpleSearchForm.results.addResult"
        component={SimpleSearchResultArray}
        data={{
          resultColumns
        }}
        deleteButtonTooltipId="ui-dashboard.simpleSearchForm.results.removeResult"
        headerId="ui-dashboard.simpleSearchForm.results"
        id="simple-search-form-results"
        name="resultColumns"
      />
      <SimpleSearchSort
        data={{
          sortColumns
        }}
      />
    </>
  );
};

SimpleSearchForm.propTypes = {
  specificWidgetDefinition: PropTypes.object
};

export default SimpleSearchForm;
