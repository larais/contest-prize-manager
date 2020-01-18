import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, TableHead, Table, TableBody, Grid, Button, Tooltip, IconButton, Hidden } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { IProject } from '../../data/Model';
import { projectRepository } from '../../data/Repository';
import ErrorDialog from '../dialogs/ErrorDialog';
import ProjectDialog from '../dialogs/ProjectDialog';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';

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
        addUser: {
            marginRight: theme.spacing(1),
        },
        contentWrapper: {
            margin: '40px 16px',
        },
        button: {
            margin: theme.spacing(1),
        },
    });

interface IPprojectProps extends WithStyles<typeof styles> {
}

interface IProjectState {
    projects: IProject[];
    dialogOpen: boolean;
    dialogIsEdit: boolean;
    dialogEditProject?: IProject;
    errorState: boolean;
}

class Projects extends Component<IPprojectProps, IProjectState> {
    constructor(props: IPprojectProps) {
        super(props);

        this.state = {
            projects: [],
            dialogOpen: false,
            dialogIsEdit: false,
            errorState: false
        }
    }

    componentDidMount() {
        try {
            projectRepository.getAll().then((result) => {
                this.setState({
                    projects: result
                });
            });
        } catch (e) {
            this.setState({ errorState: true });
        }
    }

    addActionClick = () => {
        this.setState({
            dialogOpen: true,
            dialogIsEdit: false
        });
    }

    editActionClick = (rowId: string, e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        let project: IProject | undefined = this.state.projects.find((value) => { return value._id === rowId });

        if (!project) {
            return;
        }

        this.setState({
            dialogOpen: true,
            dialogIsEdit: true,
            dialogEditProject: project
        });
    }

    deleteActionClick = (rowId: string, e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            projectRepository.remove(rowId).then(() => {
                this.setState({
                    projects: this.state.projects.filter(p => p._id !== rowId)
                });
            });
        } catch (e) {
            this.setState({ errorState: true });
        }
    }

    handleProjectAdded = (project: IProject) => {
        try {
            projectRepository.add(project)
                .then(() => {
                    this.setState({ dialogOpen: false });
                });
        } catch (e) {
            this.setState({ dialogOpen: false, errorState: true });
        }
        this.setState({
            dialogOpen: false,
            projects: this.state.projects.concat(project)
        })
    }

    handleProjectUpdated = (project: IProject) => {

        try {
            projectRepository.get(project._id)
                .then((p) => {
                    p.title = project.title;
                    p.description = project.description;
                    p.participants = project.participants;

                    projectRepository.update(p)
                        .then(() => {
                            this.setState({ dialogOpen: false });
                        })
                })
        } catch (e) {
            this.setState({ dialogOpen: false, errorState: true });
        }


        this.setState({
            dialogOpen: false,
            projects: this.state.projects.map((item, i) => { return (item._id === project._id) ? project : item; })
        })
    }

    handleDialogClosed = () => {
        this.setState({ dialogOpen: false });
    }

    handleDialogError = (e: Error) => {
        this.setState({ dialogOpen: false, errorState: true });
    }

    render() {
        return (<Paper className={this.props.classes.paper}>
            <AppBar className={this.props.classes.titleBar} position="static" color="default" elevation={0}>
                <Toolbar>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <AssignmentIcon className={this.props.classes.block} color="inherit" />
                        </Grid>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" className={this.props.classes.addUser} onClick={this.addActionClick}>
                                Add project
                            </Button>
                            <Tooltip title="Reload">
                                <IconButton>
                                    <RefreshIcon className={this.props.classes.block} color="inherit" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <Hidden mdUp>
                                <TableCell>GUID</TableCell>
                            </Hidden>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Participants</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.projects.map((row: IProject) => (
                            <TableRow key={row._id}>
                                <Hidden mdUp>
                                    <TableCell component="th" scope="row">
                                        {row._id}
                                    </TableCell>
                                </Hidden>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>{row.participants.length}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={(e) => this.editActionClick(row._id, e)} className={this.props.classes.button} aria-label="edit" title="Edit">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={(e) => this.deleteActionClick(row._id, e)} className={this.props.classes.button} aria-label="delete" title="Delete">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <ProjectDialog open={this.state.dialogOpen} editMode={this.state.dialogIsEdit} editProject={this.state.dialogEditProject} onAdded={this.handleProjectAdded} onUpdated={this.handleProjectUpdated} onClosed={this.handleDialogClosed} />
            <ErrorDialog open={this.state.errorState} text={"You need to reload the page."} />
        </Paper>
        )
    };
}

export default withStyles(styles)(Projects);