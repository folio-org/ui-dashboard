import React from 'react';
import PropTypes from 'prop-types';

import { FieldArray } from 'react-final-form-arrays';

import {
  AccordionSet,
} from '@folio/stripes/components';

import SimpleSearchFilterArray from './filters/SimpleSearchFilterArray';
import SimpleSearchResults from './results/SimpleSearchResults';
import SimpleSearchConfigurableProperties from './configurableProperties/SimpleSearchConfigurableProperties';

const SimpleSearchForm = ({
  specificWidgetDefinition,
}) => {
  const {
    configurableProperties,
    filters: {
      columns: filterColumns = []
    } = {},
    results: {
      columns: resultColumns = []
    } = {},
    sort: {
      columns: sortColumns = []
    } = {},
  } = specificWidgetDefinition?.definition;

  const initialAccordionState = {
    filters: true,
    results: true,
    sort: true
  };

  return (
    <>
      <AccordionSet initialStatus={initialAccordionState}>
        {/* This component now only displays url link stuff, consider renaming */}
        <SimpleSearchConfigurableProperties
          configurableProperties={configurableProperties}
        />
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
        <SimpleSearchResults
          data={{
            resultColumns,
            configurableProperties,
            sortColumns
          }}
          id="simple-search-form-results"
        />
      </AccordionSet>
    </>
  );
};

SimpleSearchForm.propTypes = {
  specificWidgetDefinition: PropTypes.object
};

export default SimpleSearchForm;
