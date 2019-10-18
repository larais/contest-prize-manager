import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Project from './Project';
import { IPrize, IProject } from '../data/Model';

interface IData {
    prize: IPrize;
    projects: IProject[];
  }


class Prize extends Component<IData> {
    render() {
        return (
            <div>
                <h2>{this.props.prize.title}</h2>
                <Droppable droppableId={this.props.prize._id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                    {this.props.projects.map((project, index) => <Project key={project._id} project={project} index={index} />)}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
        )
    };
}

export default Prize;