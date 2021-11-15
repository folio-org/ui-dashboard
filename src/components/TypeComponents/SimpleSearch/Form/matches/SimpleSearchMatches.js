import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Field } from 'react-final-form';

import {
  Accordion,
  Checkbox
} from '@folio/stripes/components';

import SearchField from '../../../../SearchField';
import css from './SimpleSearchMatches.css';

const SimpleSearchMatches = ({
  data: {
    matches
  },
  id
}) => {
  // If no matches in def we can ignore
  if (!matches) {
    return null;
  }

  const {
    columns,
    termConfigurable
  } = matches;

  // If non-configurable then set up form without rendering user options
  if (!termConfigurable) {
    return (
      <>
        <Field
          name="matches.term"
          render={() => null}
        />
        {columns?.map(matchCol => {
          return (
            <div
              key={`matches.matches[${matchCol.name}]`}
            >
              <Field
                name={`matches.matches[${matchCol.name}]`}
                render={() => null}
              />
            </div>
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
        component={SearchField}
        name="matches.term"
      />
      <div className={css.checkboxContainer}>
        {columns?.map(matchCol => {
          return (
            <div
              key={`matches.matches[${matchCol.name}]`}
              className={css.checkbox}
            >
              <Field
                component={Checkbox}
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

SimpleSearchMatches.propTypes = {
  data: PropTypes.shape({
    isEdit: PropTypes.bool,
    matches: PropTypes.shape({
      defaultTerm: PropTypes.string,
      columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        accessPath: PropTypes.string.isRequired,
        default: PropTypes.bool
      })).isRequired,
      termConfigurable: PropTypes.bool.isRequired
    })
  }),
  id: PropTypes.string.isRequired
};

export default SimpleSearchMatches;
