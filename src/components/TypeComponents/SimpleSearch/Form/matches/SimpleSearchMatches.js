import { FormattedMessage } from 'react-intl';

import { Field, useFormState } from 'react-final-form';

import {
  Accordion,
  Checkbox
} from '@folio/stripes/components';

import SimpleSearchField from '../../../../SimpleSearchField';
import css from './SimpleSearchMatches.css';

const SimpleSearchMatches = ({
  data: {
    isEdit,
    matches
  },
  id,
  ...rest
}) => {
  const { values } = useFormState();
  console.log('Matches: %o', matches);
  console.log('Values: %o', values);

  // If no matches in def we can ignore
  if (!matches) {
    return null;
  }

  const {
    defaultTerm,
    columns,
    termConfigurable
  } = matches;

  // If non-configurable then set up form without rendering user options
  if (!termConfigurable) {
    return (
      <>
        <Field
          defaultValue={defaultTerm}
          name="matches.term"
          render={() => null}
        />
        {columns?.map(matchCol => {
          return (
            <Field
              defaultValue={matchCol.default}
              name={`matches.matches[${matchCol.name}]`}
              render={() => null}
            />
          );
        })}
      </>
    );
  }

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-dashboard.simpleSearchForm.matches" />}
    >
      <Field
        component={SimpleSearchField}
        defaultValue={isEdit ? undefined : defaultTerm}
        name="matches.term"
      />
      <div className={css.checkboxContainer}>
        {columns?.map(matchCol => {
          return (
            <div className={css.checkbox}>
              <Field
                component={Checkbox}
                defaultValue={matchCol.default}
                label={matchCol.label ?? matchCol.name}
                name={`matches.matches[${matchCol.name}]`}
                type="checkbox"
              />
            </div>
          );
        })}
      </div>
    </Accordion>
  );
};

export default SimpleSearchMatches;
