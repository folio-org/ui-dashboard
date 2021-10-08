import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

import ActionMenu from '../../ActionMenu/ActionMenu';
import css from './DashboardHeader.css';

const propTypes = {
  onCreate: PropTypes.func.isRequired,
  onReorder: PropTypes.func
};

export default function DashboardHeader({ onCreate, onReorder }) {
  const getActionMenu = () => (
    <>
      <Button
        buttonStyle="dropdownItem"
        id="clickable-new-widget"
        onClick={onCreate}
      >
        <FormattedMessage id="ui-dashboard.dashboardHeader.new" />
      </Button>
      {onReorder &&
        <Button
          buttonStyle="dropdownItem"
          id="clickable-reorderdashboard"
          onClick={onReorder}
        >
          <FormattedMessage id="ui-dashboard.dashboardHeader.reorder" />
        </Button>
      }
    </>
  );

  return (
    <div className={css.dashboardHeader}>
      <ActionMenu actionMenu={getActionMenu} />
    </div>
  );
}

DashboardHeader.propTypes = propTypes;
