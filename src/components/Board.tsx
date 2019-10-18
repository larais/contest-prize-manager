import React, { Component } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Prize from './Prize';
import { IPrize } from '../model/IPrize';
import { IProject } from '../model/IProject';
import { prizeRepository } from '../data/PrizeRepository';

interface IState {
    prizes: { [id: string]: IPrize };
    projects: { [id: string]: IProject };
    prizesOrder: string[];
}

interface IProps {

}

class Board extends Component<{}, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            prizes: {}, prizesOrder: [], projects: {}
        }
    }

    componentDidMount() {
        prizeRepository.getAll().then((prizes) => {
            console.log(prizes);
            let prizesKV: { [pid: string]: IPrize } = {};

            prizes.forEach((p) => {
                prizesKV[p._id] = p;
            });

            this.setState({
                prizes: prizesKV,
                prizesOrder: [prizes[0]._id],
                projects: { "project-1": { _id: "project-1", title: "Project A", description: 'desc', participants: [] } }
            });
        });
    }

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
                //const projects = prize.attributedToProjectIds.map((projectId:string) => this.state.projects[projectId]);
                const projects: IProject[] = [
                    {
                        _id: "project-1",
                        title: "Project A",
                        description: 'desc',
                        participants: []
                    }];

                return <Prize key={prize._id} prize={prize} projects={projects} />;
            })
            }
        </DragDropContext>
    };
}


export default Board;