import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Project from './Project';

interface IData {
    //TODO:
    prize: any;
    projects: any[];
  }


class Prize extends Component<IData> {
    render() {
        return (
            <div>
                <h2>{this.props.prize.title}</h2>
                <Droppable droppableId={this.props.prize.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                    {this.props.projects.map((project: { id: string; content: React.ReactNode; }, index: number) => <Project key={project.id} project={project} index={index} />)}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </div>
        )
    };
}

export default Prize;