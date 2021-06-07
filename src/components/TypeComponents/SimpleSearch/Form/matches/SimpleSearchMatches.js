import { FormattedMessage } from 'react-intl';

import { Field, useFormState } from 'react-final-form';

import {
  Accordion,
  SearchField,
} from '@folio/stripes/components';
import { match } from 'sinon';

const SimpleSearchMatches = ({
  data: {
    matches
  },
  id
}) => {
  const { values } = useFormState();
  console.log('Matches: %o', matches);
  console.log('Values: %o', values);

  return (
    // TODO, deal with this mess.... Stripes components not doing what they say they should
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-dashboard.simpleSearchForm.matches" />}
    >
      <Field
        component={SearchField}
        defaultValue={match.defaultTerm}
        name="matches"
      />


    </Accordion>
  );
};

export default SimpleSearchMatches;
