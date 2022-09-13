import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import css from './DragAndDropFieldArray.css';

/* This component provides a drag and drop list for any array.
 * Must be called as a component of a FieldArray,
 * Child function can access "name" and "index" from the fields.map,
 * as well as draggable and droppable props
 * {(name, index) => {...}}
 */
const DragAndDropFieldArray = ({
  draggableDivStyle = () => null,
  getDragHandleProps = () => {},
  fields,
  children,
  renderHandle
}) => {
  const makeOnDragEndFunction = passedFields => result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // Move field to correct place in the list
    passedFields.move(result.source.index, result.destination.index);
  };

  const isRenderHandle = !!renderHandle;

  return (
    <>
      <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {fields.map((name, index) => (
                <Draggable
                  key={name}
                  draggableId={name}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot, draggableRubric) => {
                    // Condense draggable props into single object for ease of use
                    const draggable = {
                      draggableProvided,
                      draggableSnapshot,
                      draggableRubric
                    };
                    const usePortal = draggableSnapshot.isDragging;
                    const DraggableField = (
                      // Top level container, can be styled using draggableDivStyle
                      <div
                        ref={draggableProvided.innerRef}
                        className={classnames(
                          css.container,
                          draggableDivStyle(draggable)
                        )}
                        {...draggableProvided.draggableProps}
                        // If renderHandle not passed, make whole row handle
                        {
                          ...(!isRenderHandle ?
                            { ...draggableProvided.dragHandleProps } :
                            undefined
                          )
                        }
                      >
                        {/* Handle, only render if renderHandle prop passed */}
                        {isRenderHandle &&
                          <div
                            className={css.handle}
                            data-handle
                            data-testid={name}
                            {...draggableProvided.dragHandleProps}
                            {...getDragHandleProps({ name, index, item: fields.value[index] })}
                          >
                            {renderHandle({ name, index, item: fields.value[index] })}
                          </div>
                        }
                        {/* Actual dnd content, passed a bunch of props as a function */}
                        <div
                          className={css.content}
                        >
                          {children({
                            name,
                            index,
                            droppable: {
                              droppableProvided,
                              droppableSnapshot
                            },
                            draggable,
                            fields,
                            item: fields.value[index]
                          })}
                        </div>
                      </div>
                    );

                    // Have to use portal if drgaging
                    if (!usePortal) {
                      return DraggableField;
                    }

                    const container = document.getElementById('ModuleContainer');
                    return ReactDOM.createPortal(DraggableField, container);
                  }}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

DragAndDropFieldArray.propTypes = {
  children: PropTypes.func,
  draggableDivStyle: PropTypes.func,
  fields: PropTypes.object.isRequired,
  getDragHandleProps: PropTypes.func,
  renderHandle: PropTypes.func
};

export default DragAndDropFieldArray;


