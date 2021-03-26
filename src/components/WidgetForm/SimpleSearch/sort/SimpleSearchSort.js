import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field, useForm } from 'react-final-form';
import {
  Col,
  KeyValue,
  Select
} from '@folio/stripes/components';

const SimpleSearchSort = ({ data: { sortColumns } = {} }) => {
  const { change } = useForm();

  // Do this at the top of the form unconditionally for hook reasons
  const [selectedSortCol, setSSC] = useState(sortColumns[0]);

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
            defaultValue={sortColumns[0].name}
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
            defaultValue={sortColumns[0].sortTypes[0]}
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
