import React from 'react';
import { IconButton } from '@folio/stripes/components'

import css from './RowWithDelete.css';

const RowWithDelete = ({children, onDelete}) => {
  return (
    <div>
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
}

export default RowWithDelete;