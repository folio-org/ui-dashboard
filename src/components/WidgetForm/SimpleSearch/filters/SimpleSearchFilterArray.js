import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Accordion, Button, Headline, KeyValue } from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';
import SimpleSearchFilterField from './SimpleSearchFilterField';

const SimpleSearchFilterArray = ({
  addButtonId,
  addLabelId,
  data: {
    filterColumns = []
  } = {},
  deleteButtonTooltipId,
  fields,
  headerId,
  id
}) => {
  const renderFilterFields = () => {
    return (
      fields.map((fieldName, index) => (
        <EditCard
          key={`simple-search-filter-array-${fieldName}`}
          data-test-filter-number={index}
          deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
          header={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filter" values={{ index: index + 1 }} />}
          onDelete={() => fields.remove(index)}
        >
          <>
            <Field
              component={SimpleSearchFilterField}
              filterColumns={filterColumns}
              name={fieldName}
            />
          </>
        </EditCard>
      ))
    );
  };

  return (
    <Accordion
      id={id}
      label={
        <Headline margin="x-small" size="medium" tag="h2">
          <FormattedMessage id={headerId} />
        </Headline>
      }
    >
      {renderFilterFields()}
      <Button id={addButtonId} onClick={() => fields.push({})}>
        <FormattedMessage id={addLabelId} />
      </Button>
    </Accordion>
  );
};

SimpleSearchFilterArray.propTypes = {
  addButtonId: PropTypes.string,
  addLabelId: PropTypes.string,
  data: PropTypes.shape({
    filterColumns: PropTypes.arrayOf(PropTypes.object)
  }),
  deleteButtonTooltipId: PropTypes.string,
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }),
  headerId: PropTypes.string,
  id: PropTypes.string
};

export default SimpleSearchFilterArray;
