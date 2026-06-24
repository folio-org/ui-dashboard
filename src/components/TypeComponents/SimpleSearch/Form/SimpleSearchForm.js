import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { useIntl } from 'react-intl';
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
  const intl = useIntl();
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
  } = specificWidgetDefinition?.definition ?? {};

  const { resource } = specificWidgetDefinition?.definition ?? {};
  const colOverride = (col) => (
    (resource === 'entitlements' && col.name === 'resourceName' && col.label === 'Resource name') ?
      { ...col, label: intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.resourceName.localKB' }) } :
      col
  );

  const filterResourceName = filterColumns.map(colOverride);
  const resultResourceName = resultColumns.map(colOverride);
  const displayResourceName = sortColumns.map(colOverride);
  const matchesWithClarity = {
    ...matches,
    columns: matches?.columns?.map(colOverride)
  };

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
                matches: matchesWithClarity,
              }}
              id="simple-search-form-matches"
            />
            <FieldArray
              addButtonId="simple-search-form-add-filter-button"
              addLabelId="ui-dashboard.simpleSearchForm.filters.addFilter"
              component={SimpleSearchFilterArray}
              data={{
                filterColumns: filterResourceName
              }}
              deleteButtonTooltipId="ui-dashboard.simpleSearchForm.filters.removeFilter"
              headerId="ui-dashboard.simpleSearchForm.filters"
              id="simple-search-form-filters"
              name="filterColumns"
            />
            <SimpleSearchResults
              data={{
                resultColumns: resultResourceName,
                configurableProperties,
                sortColumns: displayResourceName
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
