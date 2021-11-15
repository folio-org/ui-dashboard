import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { FieldArray } from 'react-final-form-arrays';

import {
  AccordionSet,
  AccordionStatus,
  HasCommand,
  checkScope,
  collapseAllSections,
  expandAllSections
} from '@folio/stripes/components';

import SimpleSearchFilterArray from './filters/SimpleSearchFilterArray';
import SimpleSearchResults from './results/SimpleSearchResults';
import SimpleSearchMatches from './matches/SimpleSearchMatches';
import SimpleSearchConfigurableProperties from './configurableProperties/SimpleSearchConfigurableProperties';

const SimpleSearchForm = ({
  specificWidgetDefinition
}) => {
  const {
    configurableProperties,
    matches,
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

  const accordionStatusRef = useRef();

  const initialAccordionState = {
    filters: true,
    results: true,
    sort: true
  };

  const shortcuts = [
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef)
    }
  ];


  return (
    <>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <AccordionStatus ref={accordionStatusRef}>
          <AccordionSet initialStatus={initialAccordionState}>
            {/* This component now only displays url link stuff, consider renaming */}
            <SimpleSearchConfigurableProperties
              configurableProperties={configurableProperties}
            />
            <SimpleSearchMatches
              data={{
                matches,
              }}
              id="simple-search-form-matches"
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
        </AccordionStatus>
      </HasCommand>
    </>
  );
};

SimpleSearchForm.propTypes = {
  specificWidgetDefinition: PropTypes.object
};

export default SimpleSearchForm;
