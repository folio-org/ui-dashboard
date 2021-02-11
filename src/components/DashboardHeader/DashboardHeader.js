import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon
} from '@folio/stripes/components';

import css from './DashboardHeader.css';

const propTypes = {
  dashboard: PropTypes.object
};

export default function DashboardHeader({ onCreate }) {
  return (
    <div className={css.dashboardHeader}>
      <Button
        buttonProps={{
          'buttonStyle': 'primary',
          'marginBottom0': true,
        }}
        onClick={onCreate}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.new" />
      </Button>
    </div>
  );
}

DashboardHeader.propTypes = propTypes;
