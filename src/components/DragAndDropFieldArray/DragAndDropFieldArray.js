import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import css from './DragAndDropFieldArray.css';


/* This component provides a drag and drop list for any array.
 * Must be called as a component of a FieldArray,
 * Child function can access "name" and "index" from the fields.map
 * {(name, index) => {...}}
 */
const DragAndDropFieldArray = ({fields, children}) => {

  const makeOnDragEndFunction = fields => result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    // Move field to correct place in the list
    fields.move(result.source.index, result.destination.index);
  };


  return (
    <DragDropContext onDragEnd={makeOnDragEndFunction(fields)}>
      <Droppable droppableId="droppable">
        {(droppableProvided) => (
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
                {(draggableProvided, snapshot) => {
                  const usePortal = snapshot.isDragging;
                  const DraggableField = (
                    <div
                      ref={draggableProvided.innerRef}
                      className={classnames(
                        css.draggableBox,
                        draggableProvided.draggableProps.style,
                        { [css.pickedUp]: snapshot.isDragging }
                      )}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      {children(name, index)}
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
  );
};

DragAndDropFieldArray.propTypes = {
  fields: PropTypes.object,
  children: PropTypes.node
};

export default DragAndDropFieldArray;


