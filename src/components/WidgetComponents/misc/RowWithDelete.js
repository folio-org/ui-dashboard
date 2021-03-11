import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@folio/stripes/components';

import css from './RowWithDelete.css';

const RowWithDelete = ({ children, onDelete }) => {
  return (
    <div className={css.container}>
      <div className={css.children}>
        {children}
      </div>
      <div className={css.deleteIcon}>
        <IconButton
          icon="trash"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

RowWithDelete.propTypes = {
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired
};

export default RowWithDelete;
