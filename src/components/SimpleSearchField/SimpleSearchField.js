import PropTypes from 'prop-types';
import { Icon, TextField } from '@folio/stripes/components';

import css from './SimpleSearchField.css';

// Accepts the same props as TextField
const propTypes = {
  ariaLabel: PropTypes.string,
  clearSearchId: PropTypes.string,
  disabled: PropTypes.bool,
  onClear: PropTypes.func,
};

const SimpleSearchField = (props) => {
  const {
    ariaLabel,
    ...rest
  } = props;

  const searchIcon = (
    <Icon
      icon="search"
      iconClassName={css.searchIcon}
      size="small"
    />
  );

  return (
    <TextField
      {...rest}
      aria-label={rest['aria-label'] || ariaLabel}
      focussedclass={css.isFocused}
      hasClearIcon
      startControl={searchIcon}
      type="search"
    />
  );
};

SimpleSearchField.propTypes = propTypes;

export default SimpleSearchField;
