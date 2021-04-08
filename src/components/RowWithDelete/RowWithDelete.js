import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@folio/stripes/components';

import css from './RowWithDelete.css';

const RowWithDelete = ({ ariaLabel = undefined, children, onDelete }) => {
  return (
    <div className={css.container}>
      <div className={css.children}>
        {children}
      </div>
      <div className={css.deleteIcon}>
        <IconButton
          ariaLabel={ariaLabel}
          icon="trash"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

RowWithDelete.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired
};

export default RowWithDelete;
