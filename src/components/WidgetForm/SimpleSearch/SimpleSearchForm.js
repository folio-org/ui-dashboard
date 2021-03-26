import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useForm } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  AccordionSet,
} from '@folio/stripes/components';

import SimpleSearchFilterArray from './filters/SimpleSearchFilterArray';
import SimpleSearchResults from './results/SimpleSearchResults';
import SimpleSearchConfigurableProperties from './configurableProperties/SimpleSearchConfigurableProperties';

const SimpleSearchForm = ({
  defChanged,
  specificWidgetDefinition,
  toggleDefChange
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
  } = JSON.parse(specificWidgetDefinition?.definition);
  const { change } = useForm();

  /*
   * Here we can reset individual dynamic form elements when definition changes
   * Doing it this way because "reset" and "restart" at the form level
   * seem to leave fields behind when dirtied, even with destroyOnUnregister
  */
  useEffect(() => {
    if (defChanged) {
      change('filterColumns', undefined);
      change('resultColumns', undefined);
      change('sortColumns', undefined);
      toggleDefChange();
    }
  }, [change, defChanged, toggleDefChange]);

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
  defChanged: PropTypes.bool.isRequired,
  specificWidgetDefinition: PropTypes.object,
  toggleDefChange: PropTypes.func.isRequired
};

export default SimpleSearchForm;
