import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Accordion, Button } from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import css from './filters.css';
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
      <div data-testid="simple-search-filter-array">
        {fields.map((fieldName, index) => (
          <>
            <div
              key={`simple-search-filter-array-${fieldName}-orAnd[${index}]`}
              className={css.orAnd}
            >
              {index !== 0 &&
                <FormattedMessage
                  id="ui-dashboard.simpleSearchForm.filters.filterField.rule.and"
                />
              }
            </div>
            <EditCard
              key={`simple-search-filter-array-${fieldName}[${index}]`}
              data-test-filter-number={index}
              data-testid={`simple-search-field-array[${index}]`}
              deleteButtonTooltipText={<FormattedMessage id={deleteButtonTooltipId} values={{ index: index + 1 }} />}
              header={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filter" values={{ index: index + 1 }} />}
              onDelete={() => fields.remove(index)}
            >
              <>
                <Field
                  component={SimpleSearchFilterField}
                  filterColumns={filterColumns}
                  id={`simple-search-filter-field-card[${index}]`}
                  name={fieldName}
                />
              </>
            </EditCard>
          </>
        ))}
      </div>
    );
  };

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id={headerId} />}
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
