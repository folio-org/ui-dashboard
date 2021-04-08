import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';
import {
  Col,
  KeyValue,
  Select
} from '@folio/stripes/components';

const SimpleSearchSort = ({ data: { sortColumns } = {} }) => {
  const { change } = useForm();
  const { values } = useFormState();

  // Do this at the top of the form unconditionally for hook reasons
  const [selectedSortCol, setSSC] = useState({});
  // Keep selectedSortCol in line with selected value, obeying initial values
  useEffect(() => {
    if (!values?.sortColumn?.name) {
      setSSC(sortColumns[0]);
      // No initial value, set to be the first in the list
      // Doing this in a useEffect because defaultValue has some screwy behaviour where no initialValue exists at first
      change('sortColumn.name', sortColumns[0].name);
      change('sortColumn.sortType', sortColumns[0].sortTypes[0]);
    } else {
      // We have an existing sort column in values, filter incoming sort columns to just the selected one
      const filteredSortColumn = sortColumns.filter(sc => sc.name === values.sortColumn.name)[0];
      if (filteredSortColumn !== selectedSortCol) {
        setSSC(filteredSortColumn);
      }
    }
  }, [change, selectedSortCol, setSSC, sortColumns, values]);

  // Check if there are >1 sortOptions
  const sortCount = sortColumns.reduce((acc, cur) => {
    return acc + cur.sortTypes?.length ?? 0;
  }, 0);

  // No sort options at all, return null and have no sort configured
  if (sortCount === 0) {
    return null;
  }

  // Only a single sort option, render a hidden form option to submit sort without choice
  if (sortCount === 1) {
    return (
      <>
        <Field
          defaultValue={sortColumns[0].name}
          name="sortColumn.name"
          render={() => {
            return null;
          }}
        />
        <Field
          defaultValue={sortColumns[0].sortTypes[0]}
          name="sortColumn.sortType"
          render={() => {
            return null;
          }}
        />
      </>
    );
  }
  // We have multiple options
  const selectifiedSortColumns = sortColumns.map(sc => ({ value: sc.name, label: sc.label || sc.name }));
  const selectifiedSortDirs = selectedSortCol?.sortTypes?.map(st => ({ value: st, label: st })) || [];

  return (
    <>
      <Col xs={3}>
        <KeyValue
          data-testid="simple-search-sort-sort-by"
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.sort.sortBy" />}
        >
          <Field
            component={Select}
            dataOptions={selectifiedSortColumns}
            name="sortColumn.name"
            onChange={e => {
              setSSC(sortColumns.find(sc => sc.name === e.target.value));
              /*
                * This means you can't set sort order THEN sortBy,
                * but this is because in the definition sort direction belongs to the sortBy
              */
              change('sortColumn.sortType', selectedSortCol.sortTypes[0]);
              change('sortColumn.name', e.target.value);
            }}
          />
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue
          data-testid="simple-search-sort-sort-direction"
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.sort.sortDirection" />}
        >
          <Field
            component={Select}
            dataOptions={selectifiedSortDirs}
            disabled={selectifiedSortDirs.length <= 1}
            name="sortColumn.sortType"
          />
        </KeyValue>
      </Col>
    </>
  );
};

SimpleSearchSort.propTypes = {
  data: PropTypes.shape({
    sortColumns: PropTypes.arrayOf(PropTypes.object)
  })
};

export default SimpleSearchSort;
