import React, { Component } from "react";
import { Button, FormGroup, TextField } from '@material-ui/core';
import { IParticipant, IProject } from '../data/Model';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { participantRepository } from "../data/Repository";

interface IProjectDialogProps {
    editMode: boolean;
    editProject?: IProject;
    open: boolean;
    onAdded(project: IProject): void;
    onUpdated(project: IProject): void;
    onClosed(): void;
}

interface IProjectDialogState {
    dialogTitle: string;
    dialogDescription: string;
    dialogParticipants: IParticipant[];
    loading: boolean;
    dialogTitleError: boolean;
    allParticipants: IParticipant[];
}

class ProjectDialog extends Component<IProjectDialogProps, IProjectDialogState> {

    constructor(props: IProjectDialogProps) {
        super(props);

        this.state = {
            dialogTitle: "",
            dialogDescription: "",
            dialogParticipants: [],
            allParticipants: [],
            loading: false,
            dialogTitleError: false
        }
    }

    componentDidUpdate = (prevProps: IProjectDialogProps) => {
        if (prevProps.open !== this.props.open && this.props.open) {
            this.setState({ loading: true });

            try {
                participantRepository.getAll().then((result) => {

                    if (this.props.editMode && this.props.editProject) {

                        let project = this.props.editProject;

                        let existingParticipants: IParticipant[] = [];

                        project.participants.forEach((pid) => {
                            let match = result.find(p => p._id === pid);
                            if (match) {
                                existingParticipants.push(match);
                            }
                        });

                        this.setState({
                            loading: false,
                            allParticipants: result,
                            dialogTitle: project.title,
                            dialogDescription: project.description,
                            dialogParticipants: existingParticipants,
                            dialogTitleError: false
                        });

                    } else if (!this.props.editMode) {
                        this.setState({
                            loading: false,
                            allParticipants: result,
                            dialogTitle: "",
                            dialogDescription: "",
                            dialogParticipants: [],
                            dialogTitleError: false
                        });
                    }

                });
            } catch (e) {
                this.setState({ allParticipants: [], loading: false });
            }
        }
    }

    handleClose = () => {
        this.props.onClosed();
    }

    handleSave = () => {

        this.setState({ loading: true });

        if (this.checkInputInvalid()) {
            this.setState({ loading: false });
            return;
        }

        if (this.props.editMode && this.props.editProject) {
            let project = this.props.editProject;
            project.title = this.state.dialogTitle;
            project.description = this.state.dialogDescription;
            project.participants = this.state.dialogParticipants.map(p => p._id);

            this.props.onUpdated(project);
        } else {
            let project: IProject = {
                _id: '',
                title: this.state.dialogTitle,
                description: this.state.dialogDescription,
                participants: this.state.dialogParticipants.map(p => p._id)
            }

            this.props.onAdded(project);
        }
    }

    checkInputInvalid(): boolean {
        let titleError = this.state.dialogTitle === "";
        this.setState({ dialogTitleError: titleError });
        return titleError;
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth={true} maxWidth={"xs"}>
                <DialogTitle id="form-dialog-title">{this.props.editMode ? "Edit Project" : "Add Project"}</DialogTitle>
                <DialogContent>
                    <FormGroup>
                        <FormControl>
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <Input id="title" autoFocus value={this.state.dialogTitle} onChange={(e) => this.setState({ dialogTitle: e.target.value })} error={this.state.dialogTitleError} />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="description">Description</InputLabel>
                            <Input id="description" value={this.state.dialogDescription} onChange={(e) => this.setState({ dialogDescription: e.target.value })} />
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Autocomplete
                            multiple
                            options={this.state.allParticipants}
                            getOptionLabel={(option: IParticipant) => option.firstName + " " + option.lastName}
                            value={this.state.dialogParticipants}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Participants"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                            onChange={(e, v) => this.setState({ dialogParticipants: v })}
                        />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary" disabled={this.state.loading}>
                        Cancel
                  </Button>
                    <Button onClick={this.handleSave} color="primary" disabled={this.state.loading}>
                        Save
                  </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ProjectDialog;