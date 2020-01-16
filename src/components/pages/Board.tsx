import React, { Component } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import PrizeBoardElement from '../board_elements/PrizeBoardElement';
import { IPrize, IProject } from '../../data/Model';
import { prizeRepository, projectRepository } from '../../data/Repository';
import { Paper, Grid, Typography, AppBar, Toolbar } from '@material-ui/core';
import CompareArrowIcon from '@material-ui/icons/CompareArrowsOutlined';


const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: 'auto',
      overflow: 'hidden',
    },
    titleBar: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    block: {
      display: 'block',
    },
    contentWrapper: {
      margin: '40px 16px',
    },
    button: {
      margin: theme.spacing(1),
    },
});

interface IBoardState {
    prizes: { [id: string]: IPrize };
    prizeProjects: { [id: string]: IProject[] };
    prizesOrder: string[];
    i: number;
}

interface IBoardProps  extends WithStyles<typeof styles> {
}

class Board extends Component<IBoardProps, IBoardState> {

    constructor(props: IBoardProps) {
        super(props);

        this.state = {
            prizes: {},
            prizesOrder: [],
            prizeProjects: {},
            i: 1
        }
    }

    componentDidMount() {
        console.log("hello mount");

        this.loadBoardData();
    }

    loadBoardData() {
        prizeRepository.getAll().then((prizes) => {

            let prizesKV: { [pid: string]: IPrize } = {};
            prizes.forEach((p) => {
                prizesKV[p._id] = p;
            });

            let prizeOrder: string[] = [];
            prizes.forEach((p) => {
                prizeOrder.push(p._id);
            });

            projectRepository.getAll().then(projects => {
                let projectsKV: { [pid: string]: IProject } = {};
                projects.forEach((p) => {
                    projectsKV[p._id] = p;
                });


                let prizeProjects: { [id: string]: IProject[] } = {};

                prizes.forEach((v) => {
                    prizeProjects[v._id] = [];

                    v.projects.forEach(pid => {
                        prizeProjects[v._id].push(projectsKV[pid]);
                        delete projectsKV[pid];
                    });
                });

                let naPrize: IPrize = {
                    _id: "na",
                    title: "Not attributed",
                    capacity: -1,
                    minAge: 0,
                    maxAge: 0,
                    location: "",
                    projects: []
                };

                prizeProjects[naPrize._id] = [];

                for (const key in projectsKV) {
                    if (projectsKV.hasOwnProperty(key)) {
                        const project = projectsKV[key];
                        
                        naPrize.projects.push(key);
                        prizeProjects[naPrize._id].push(project);
                    }
                }

                prizesKV[naPrize._id] = naPrize;
                prizeOrder.push(naPrize._id);

                this.setState({
                    prizes: prizesKV,
                    prizesOrder: prizeOrder,
                    prizeProjects: prizeProjects
                });
            });
        });
    }

    onDragStart() {
        //TODO:
        console.log("HELLO, onDragStart");
    }
    onDragUpdate() {
        //TODO:
        console.log("HELLO, onDragUpdate");
    }
    onDragEnd(result: DropResult) {
        //TODO:
        console.log("HELLO, onDragEnd");
        console.log(result);

        if (!result.destination) {
            //Dragged outside of the lists
            
            //TODO: save order: result.source.index ...
            return;
        }

        //TODO: update state first :/


        console.log("h");
        let projectId = result.draggableId;
        console.log(this);
        if (result.destination) {
            let newPrizeId = result.destination.droppableId;
            console.log("h");
            if (result.source.droppableId === "na") {
                prizeRepository.get(newPrizeId)
                    .then(newPrize => {
                        newPrize.projects.push(projectId);
                        prizeRepository.update(newPrize);

                        /*this.state.prizeProjects["na"] = this.state.prizeProjects["na"].filter(p => p._id !== projectId);
                        this.state.prizes["na"].projects = this.state.prizes["na"].projects.filter(p => p !== projectId);

                        this.state.prizeProjects[newPrizeId].push(this.state.)

                        this.setState({
                            prizeProjects: this.state.prizeProjects
                        })*/
                        
                        this.loadBoardData();
                        console.log("all done h");
                });
            } else {
                prizeRepository.get(result.source.droppableId)
                .then(oldPrize => {
                    console.log("a");
                    oldPrize.projects = oldPrize.projects.filter(pid => pid !== projectId);
                    prizeRepository.update(oldPrize)
                        .then(() => {
                            console.log("a");
                            if (newPrizeId === "na") {
                                this.loadBoardData();
                                return;
                            }

                            prizeRepository.get(newPrizeId)
                                .then(newPrize => {
                                    newPrize.projects.push(projectId);
                                    prizeRepository.update(newPrize)
                                        .catch(error => {
                                            //...
                                        })
                                    console.log("all done a");
                                    this.loadBoardData();
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        })
                });
            }
        }

        //this.setState();
    }

    render() {
        console.log("HELLO, render");
        return (
        <Paper className={this.props.classes.paper}>
            <AppBar className={this.props.classes.titleBar} position="static" color="default" elevation={0}>
                <Toolbar>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                    <CompareArrowIcon className={this.props.classes.block} color="inherit" />
                    </Grid>
                    <Grid item xs>
                    <Typography variant="h6">
                        Board
                    </Typography>
                    </Grid>
                </Grid>
                </Toolbar>
            </AppBar>

        <DragDropContext
            onDragStart={this.onDragStart}
            onDragUpdate={this.onDragUpdate}
            onDragEnd={(e) => this.onDragEnd(e)}>
            {this.state.prizesOrder.map((prizeId: string) => {
                const prize = this.state.prizes[prizeId];

                return <PrizeBoardElement key={prize._id} prize={prize} projects={this.state.prizeProjects[prizeId]} />;
            })
            }
        </DragDropContext>
        </Paper>
        )
    };
}


export default withStyles(styles)(Board);