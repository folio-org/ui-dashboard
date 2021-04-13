import React from 'react';
import PropTypes from 'prop-types';

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
  validateFields: PropTypes.arrayOf(PropTypes.string)
};

const RelativeOrAbsolute = ({
  absoluteComponent,
  disabled = false,
  name,
  relativeComponent,
  validateFields = []
}) => {
  return (
    <>
      <Row className={css.innerRow}>
        <div className={css.flexContainer}>
          <div className={css.radioButton}>
            <Field
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
            {absoluteComponent}
          </div>
        </div>
      </Row>
      <Row className={css.innerRow}>
        <div className={css.flexContainer}>
          <div className={css.radioButton}>
            <Field
              component={RadioButton}
              disabled={disabled}
              name={`${name}.relativeOrAbsolute`}
              type="radio"
              validateFields={validateFields}
              value="absolute"
            />
          </div>
          <div className={css.item}>
            {relativeComponent}
          </div>
        </div>
      </Row>
    </>
  );
};

RelativeOrAbsolute.propTypes = propTypes;
export default RelativeOrAbsolute;
