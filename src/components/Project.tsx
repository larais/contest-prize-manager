import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface IData {
    project:any;
    index:any;
}
class Project extends Component<IData> {
    render() {
        return (
            <Draggable draggableId={this.props.project.id} index={this.props.index}>
            {(provided) => (
                <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                {this.props.project.title}
                </div>
            )}
            </Draggable>
        )
    };
}


export default Project;