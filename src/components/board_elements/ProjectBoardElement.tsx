import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IProject } from '../../data/Model';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    projectItem: {
        border: "2px solid transparent",
        backgroundColor: "white",
        minHeight: 60,
        minWidth: 200,
        margin: 2
    }
});

interface IProjectBoardElementProps extends WithStyles<typeof styles> {
    project: IProject;
    index:any;
}

class ProjectBoardElement extends Component<IProjectBoardElementProps> {
    render() {
        return (
            <Draggable draggableId={this.props.project._id} index={this.props.index}>
            {(provided) => (
                <div className={this.props.classes.projectItem}
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


export default withStyles(styles)(ProjectBoardElement);