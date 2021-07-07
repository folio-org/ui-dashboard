import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import {
  Button
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import css from './filters.css';
import SimpleSearchFilterRuleField from './SimpleSearchFilterRuleField';

const SimpleSearchFilterRuleArray = ({
  fields,
  filterComponent,
  filterComponentProps,
  selectedFilterColumn
}) => {
  const renderRuleFields = () => {
    return (
      fields.map((fieldName, index) => {
        return (
          <div
            key={`simple-search-filter-rule-array-${fieldName}`}
          >
            <div
              className={css.orAnd}
            >
              {index !== 0 &&
                <FormattedMessage
                  id="ui-dashboard.simpleSearchForm.filters.filterField.rule.or"
                />
              }
            </div>
            <EditCard
              data-test-filter-rule-number={index}
              data-testid={`simple-search-filter-rule-array[${index}]`}
              deleteButtonTooltipText={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.rule.removeRule" values={{ index: index + 1 }} />}
              header={<FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.rule" values={{ index: index + 1 }} />}
              onDelete={
                index !== 0 ?
                  () => fields.remove(index) :
                  undefined
              }
            >
              <Field
                component={SimpleSearchFilterRuleField}
                filterComponent={filterComponent}
                filterComponentProps={filterComponentProps}
                name={fieldName}
                selectedFilterColumn={selectedFilterColumn}
              />
            </EditCard>
          </div>
        );
      })
    );
  };

  return (
    <>
      {renderRuleFields()}
      <Button
        id="simple-search-form-add-filter-rule-button"
        onClick={() => fields.push({})}
      >
        <FormattedMessage id="ui-dashboard.simpleSearchForm.filters.filterField.rule.addRule" />
      </Button>
    </>
  );
};

SimpleSearchFilterRuleArray.propTypes = {
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }).isRequired,
  filterComponent: PropTypes.object,
  filterComponentProps: PropTypes.object,
  selectedFilterColumn: PropTypes.object
};

export default SimpleSearchFilterRuleArray;
