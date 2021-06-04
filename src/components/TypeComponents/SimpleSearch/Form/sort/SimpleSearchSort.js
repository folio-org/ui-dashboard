import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field, useForm, useFormState } from 'react-final-form';
import {
  Col,
  Select
} from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';

const SimpleSearchSort = ({ data: { sortColumns } = {} }) => {
  const { change } = useForm();
  const { initialValues } = useFormState();

  // Do this at the top of the form unconditionally for hook reasons
  const [selectedSortCol, setSSC] = useState(sortColumns[0]);
  useEffect(() => {
    // If we have initialValues make sure the SSC gets set properly
    if (initialValues?.sortColumn?.name) {
      setSSC(sortColumns.find(sc => sc.name === initialValues.sortColumn.name));
    }
  }, [change, initialValues, sortColumns]);

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
        <Field
          component={Select}
          dataOptions={selectifiedSortColumns}
          defaultValue={sortColumns[0]?.name}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.sort.sortBy" />}
          name="sortColumn.name"
          onChange={e => {
            const newSortColumn = sortColumns.find(sc => sc.name === e.target.value);
            setSSC(newSortColumn);
            /*
              * This means you can't set sort order THEN sortBy,
              * but this is because in the definition sort direction belongs to the sortBy
            */
            change('sortColumn.name', e.target.value);
            change('sortColumn.sortType', newSortColumn.sortTypes[0]);
          }}
          required
          validate={requiredValidator}
        />
      </Col>
      <Col xs={3}>
        <Field
          component={Select}
          dataOptions={selectifiedSortDirs}
          defaultValue={selectedSortCol.sortTypes[0]}
          disabled={selectifiedSortDirs.length <= 1}
          label={<FormattedMessage id="ui-dashboard.simpleSearchForm.sort.sortDirection" />}
          name="sortColumn.sortType"
        />
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
