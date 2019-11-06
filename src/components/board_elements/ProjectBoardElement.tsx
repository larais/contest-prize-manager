import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IProject } from '../../data/Model';

interface IData {
    project: IProject;
    index:any;
}
class ProjectBoardElement extends Component<IData> {
    render() {
        return (
            <Draggable draggableId={this.props.project._id} index={this.props.index}>
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


export default ProjectBoardElement;