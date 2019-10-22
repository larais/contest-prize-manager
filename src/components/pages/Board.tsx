import React, { Component } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Prize from '../Prize';
import { IPrize, IProject } from '../../data/Model';
import { prizeRepository } from '../../data/Repository';

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

            let prizesKV: { [pid: string]: IPrize } = {};
            prizes.forEach((p) => {
                prizesKV[p._id] = p;
            });

            let prizeOrder: string[] = [];
            prizes.forEach((p) => {
                prizeOrder.push(p._id);
            });

            this.setState({
                prizes: prizesKV,
                prizesOrder: prizeOrder,
                projects: { "project-1": { _id: "project-1", title: "Project A", description: 'desc', participants: [] } }
            });
        });

        let prize = {
            _id: '',
            title: "test",
            capacity: 3,
            location: "Helloo",
            minAge: 2,
            maxAge: 3,
            projects: []
        } as IPrize;

        prizeRepository.add(prize)
            .then(() => {
                console.log(prize);

                prize.title = "updated title";

                prizeRepository.update(prize)
                    .then(() => {
                        console.log(prize);

                        prizeRepository.remove(prize._id)
                            .then(() => {
                                prizeRepository.get(prize._id)
                                    .then((p) => {
                                        console.log(p);
                                    })
                                    .catch((e) => {
                                        console.log('error, lele');
                                    });
                            });

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