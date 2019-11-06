import React, { Component } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import PrizeBoardElement from '../board_elements/PrizeBoardElement';
import { IPrize, IProject } from '../../data/Model';
import { prizeRepository } from '../../data/Repository';
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
    projects: { [id: string]: IProject };
    prizesOrder: string[];
}

interface IBoardProps  extends WithStyles<typeof styles> {
}

class Board extends Component<IBoardProps, IBoardState> {

    constructor(props: IBoardProps) {
        super(props);

        this.state = {
            prizes: {},
            prizesOrder: [],
            projects: {}
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
        if (!result.destination) {
            //Dragged outside of the lists
            return;
        }

        if (result.destination.index === result.source.index) {
            //Only changed order, element still in the same prize container
            return;
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

                return <PrizeBoardElement key={prize._id} prize={prize} projects={projects} />;
            })
            }
        </DragDropContext>
        </Paper>
        )
    };
}


export default withStyles(styles)(Board);