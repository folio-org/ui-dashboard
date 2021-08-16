import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage, useIntl } from 'react-intl';
import { FieldArray } from 'react-final-form-arrays';
import { Field } from 'react-final-form';

import {
  Accordion,
  Button,
  Col,
  Headline,
  Icon,
  IconButton,
  MessageBanner,
  Row,
  TextField
} from '@folio/stripes/components';

import SimpleSearchResultField from './SimpleSearchResultField';
import SimpleSearchSort from '../sort';
import DragAndDropFieldArray from '../../../../DragAndDropFieldArray';

import css from './SimpleSearchResults.css';

const SimpleSearchResults = ({
  data: {
    resultColumns,
    configurableProperties: {
      numberOfRows = {},
    } = {},
    sortColumns
  } = {},
  id
}) => {
  const intl = useIntl();
  const renderResultField = (fieldName, index, _droppable, _draggable, fields) => {
    return (
      <div className={css.resultLine}>
        <Row key={`simple-search-result-array-${fieldName}`} middle="xs">
          <Col xs={11}>
            <Field
              component={SimpleSearchResultField}
              name={fieldName}
              resultColumns={resultColumns}
            />
          </Col>
          <Col className={css.deleteIcon} xs={1}>
            <IconButton
              ariaLabel={
                intl.formatMessage(
                  { id: 'ui-dashboard.simpleSearchForm.results.resultDeleteAria' },
                  { index: index + 1 }
                )
              }
              icon="trash"
              onClick={() => fields.remove(index)}
            />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-dashboard.simpleSearchForm.results" />}
    >
      <Row>
        <Col xs={numberOfRows.configurable ? 3 : 0}>
          <Field
            defaultValue={numberOfRows.defValue}
            name="configurableProperties.numberOfRows"
            type="number"
          >
            {({ ...fieldRenderProps }) => {
              if (numberOfRows.configurable) {
                return (
                  <TextField
                    {...fieldRenderProps}
                    data-testid="simple-search-configurable-properties-number-of-rows"
                    id="simple-search-configurable-properties-number-of-rows"
                    label={<FormattedMessage id="ui-dashboard.simpleSearchForm.configurableProperties.numberOfRows" />}
                  />
                );
              }
              // We know that if numberOfRows is non-configurable then it MUST have a defValue (FROM TYPE SCHEMA)
              // We still want that to be submitted, but no field to render on the form
              return null;
            }}
          </Field>
        </Col>
        <SimpleSearchSort
          data={{
            sortColumns
          }}
        />
      </Row>
      <FieldArray
        name="resultColumns"
        render={({ fields, meta: { valid } }) => {
          return (
            <>
              <Headline margin="x-small" size="medium" tag="h2">
                <FormattedMessage id="ui-dashboard.simpleSearchForm.results.columns" />
              </Headline>
              <DragAndDropFieldArray
                fields={fields}
                renderHandle={() => (
                  <Icon
                    icon="drag-drop"
                    iconRootClass={css.dragHandle}
                  />
                )}
              >
                {renderResultField}
              </DragAndDropFieldArray>
              {!valid &&
                <MessageBanner
                  className={css.warningBanner}
                  tabIndex={0}
                  type="error"
                >
                  <FormattedMessage id="ui-dashboard.simpleSearchForm.results.minimumWarning" />
                </MessageBanner>
              }
              <Button id="simple-search-form-add-result-column-button" onClick={() => fields.push({})}>
                <FormattedMessage id="ui-dashboard.simpleSearchForm.results.addResult" />
              </Button>
            </>
          );
        }}
        validate={(value) => {
          if (!value?.length) {
            // This validation does not render, but changes the valid prop in the render above
            return 'this should not display';
          }
          return undefined;
        }}
      />
    </Accordion>
  );
};

SimpleSearchResults.propTypes = {
  data: PropTypes.shape({
    resultColumns: PropTypes.arrayOf(PropTypes.object)
  }),
  fields: PropTypes.shape({
    map: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
  }),
  id: PropTypes.string
};

export default SimpleSearchResults;
