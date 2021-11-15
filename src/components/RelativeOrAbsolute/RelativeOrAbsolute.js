import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Field } from 'react-final-form';

import {
  RadioButton,
  Row,
} from '@folio/stripes/components';

import css from './RelativeOrAbsolute.css';

const propTypes = {
  absoluteComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  relativeComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  renderToday: PropTypes.bool,
  validateFields: PropTypes.arrayOf(PropTypes.string)
};

const RelativeOrAbsolute = ({
  absoluteComponent,
  disabled = false,
  name,
  relativeComponent,
  validateFields = [],
  renderToday
}) => {
  const intl = useIntl();

  return (
    <>
      {renderToday &&
        <Row className={css.innerRow}>
          <div className={css.radioButton}>
            <Field
              aria-label={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.today' })}
              component={RadioButton}
              disabled={disabled}
              label={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.today' })}
              labelClass={css.radioLabelClass}
              name={`${name}.relativeOrAbsolute`}
              type="radio"
              value="today"
            />
          </div>
        </Row>
      }
      <Row className={css.innerRow}>
        <div className={css.flexContainer}>
          <div className={css.radioButton}>
            <Field
              aria-label={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.relativeDate' })}
              component={RadioButton}
              defaultValue="absolute"
              disabled={disabled}
              name={`${name}.relativeOrAbsolute`}
              type="radio"
              validateFields={validateFields}
              value="relative"
            />
          </div>
          <div className={css.item}>
            {relativeComponent}
          </div>
        </div>
      </Row>
      <Row className={css.innerRow}>
        <div className={css.flexContainer}>
          <div className={css.radioButton}>
            <Field
              aria-label={intl.formatMessage({ id: 'ui-dashboard.simpleSearchForm.filters.dateFilterField.fixedDate' })}
              component={RadioButton}
              disabled={disabled}
              name={`${name}.relativeOrAbsolute`}
              type="radio"
              validateFields={validateFields}
              value="absolute"
            />
          </div>
          <div className={css.item}>
            {absoluteComponent}
          </div>
        </div>
      </Row>
    </>
  );
};

RelativeOrAbsolute.propTypes = propTypes;
export default RelativeOrAbsolute;
