import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ProjectBoardElement from './ProjectBoardElement';
import { IPrize, IProject } from '../../data/Model';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';


const styles = (theme: Theme) =>
  createStyles({
    droppable: {
        display: "flex",
        alignItems: "start",
        minWidth: 600,
        minHeight: 60,
        backgroundColor: "rgb(235, 236, 240)",
        padding: 5
    },
    prizeList: {
        backgroundColor: "rgb(217, 217, 218)"
    },
    title: {
        paddingLeft: 10
    }
});

interface IPrizeBoardElementProps extends WithStyles<typeof styles> {
    prize: IPrize;
    projects: IProject[];
}

class PrizeBoardElement extends Component<IPrizeBoardElementProps> {
    render() {
        return (
            <div className={this.props.classes.prizeList}>
                <h2 className={this.props.classes.title}>{this.props.prize.title}</h2>
                <Droppable droppableId={this.props.prize._id} direction="horizontal">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            className={this.props.classes.droppable}
                            {...provided.droppableProps}
                        >
                        {this.props.projects.map((project, index) => <ProjectBoardElement key={project._id} project={project} index={index} />)}
                        {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    };
}

export default withStyles(styles)(PrizeBoardElement);