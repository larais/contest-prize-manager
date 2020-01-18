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
    projects: { [id: string]: IProject };
}

interface IBoardProps extends WithStyles<typeof styles> {
}

class Board extends Component<IBoardProps, IBoardState> {

    private static notAttributedDroppableId: string = "not-attributed";

    constructor(props: IBoardProps) {
        super(props);

        this.state = {
            prizes: {},
            prizesOrder: [],
            prizeProjects: {},
            projects: {}
        }
    }

    componentDidMount() {
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
                let allProjectsKV: { [pid: string]: IProject } = {};

                let projectsKV: { [pid: string]: IProject } = {};
                projects.forEach((p) => {
                    projectsKV[p._id] = p;
                    allProjectsKV[p._id] = p;
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
                    _id: Board.notAttributedDroppableId,
                    title: "Not Attributed",
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
                    prizeProjects: prizeProjects,
                    projects: allProjectsKV
                });
            });
        });
    }

    onDragStart() {
    }

    onDragUpdate() {
    }

    onDragEnd(result: DropResult) {

        if (!result.destination) {
            return;
        }

        let state: IBoardState = {
            prizes: this.state.prizes,
            prizesOrder: this.state.prizesOrder,
            prizeProjects: this.state.prizeProjects,
            projects: this.state.projects
        };
        if (result.destination) {
            let projectId = result.draggableId;
            let sourcePrizeId = result.source.droppableId;
            let targetPrizeId = result.destination.droppableId;

            this.moveDraggable(state, projectId, sourcePrizeId, targetPrizeId);
            this.updatePrizes([sourcePrizeId, targetPrizeId]);
            this.setState(state);
        }
    }

    moveDraggable = (state: IBoardState, projectId: string, fromPrize: string, toPrize: string): void => {
        state.prizeProjects[fromPrize] = state.prizeProjects[fromPrize].filter(p => p._id !== projectId);
        state.prizes[fromPrize].projects = state.prizes[fromPrize].projects.filter(p => p !== projectId);
        state.prizeProjects[toPrize].push(state.projects[projectId]);
        state.prizes[toPrize].projects.push(projectId);
    }

    updatePrizes = async (prizeIds: string[]) => {

        for (let index = 0; index < prizeIds.length; index++) {
            const prizeId = prizeIds[index];

            if (prizeId === Board.notAttributedDroppableId) {
                continue;
            }

            await prizeRepository.get(prizeId)
                .then(prize => {
                    prize.projects = this.state.prizes[prizeId].projects;
                    prizeRepository.update(prize)
                            .catch(error => {
                                console.log(error);
                            })
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
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