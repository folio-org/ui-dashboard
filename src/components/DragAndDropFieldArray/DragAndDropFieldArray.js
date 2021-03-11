import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/* This component provides a drag and drop list for any array.
 * Must be called as a component of a FieldArray,
 * Child function can access "name" and "index" from the fields.map,
 * as well as draggable and droppable props
 * {(name, index) => {...}}
 */
const DragAndDropFieldArray = ({
  draggableDivStyle = () => null,
  fields,
  children
}) => {
  const makeOnDragEndFunction = passedFields => result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // Move field to correct place in the list
    passedFields.move(result.source.index, result.destination.index);
  };

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
                      <div
                        {...draggableDivStyle(draggable)}
                        ref={draggableProvided.innerRef}
                        data-testid={name}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        {children(
                          name,
                          index,
                          {
                            droppableProvided,
                            droppableSnapshot
                          },
                          draggable,
                          fields
                        )}
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
  draggableDivStyle: PropTypes.func,
  fields: PropTypes.object.isRequired,
  children: PropTypes.func,
};

export default DragAndDropFieldArray;


