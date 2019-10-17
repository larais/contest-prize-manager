import React, { Component } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Prize from './Prize';
import mockData from './../mock-data';

class Board extends Component {
    state:any = mockData;

    onDragStart() {
        //TODO:
    }
    onDragUpdate() {
        //TODO:
    }
    onDragEnd(result: DropResult) {
        //TODO:
    }

    render() {
        return <DragDropContext
            onDragStart={this.onDragStart}
            onDragUpdate={this.onDragUpdate}
            onDragEnd={this.onDragEnd}>
            {this.state.prizesOrder.map((prizeId: string) => {
                const prize = this.state.prizes[prizeId];
                const projects = prize.attributedToProjectIds.map((projectId:string) => this.state.projects[projectId]);
                
                return <Prize key={prize.id} prize={prize} projects={projects} />;
                })
            }
        </DragDropContext>
    };
}


export default Board;