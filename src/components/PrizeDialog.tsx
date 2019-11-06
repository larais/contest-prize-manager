import React, { Component } from "react";
import { Button, FormGroup, TextField } from '@material-ui/core';
import { IPrize } from '../data/Model';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { participantRepository } from "../data/Repository";

interface IPrizeDialogProps {
    editMode: boolean;
    editProject?: IPrize;
    open: boolean;
    onAdded(project: IPrize): void;
    onUpdated(project: IPrize): void;
    onClosed(): void;
}

interface IPrizeDialogState {
    dialogTitle: string;
    dialogDescription: string;
    //dialogParticipants: IParticipant[];
    loading: boolean;
    dialogTitleError: boolean;
    //allParticipants: IParticipant[];
}

class PrizeDialog extends Component<IPrizeDialogProps, IPrizeDialogState> {
    constructor(props: IPrizeDialogProps) {
        super(props);

        this.state = {
            dialogTitle: "",
            dialogDescription: "",
            //dialogParticipants: [],
            //allParticipants: [],
            loading: false,
            dialogTitleError: false
        }
    }

    handleClose = () => {
        this.props.onClosed();
    }
    
    render() {
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth={true} maxWidth={"xs"}>

            </Dialog>
        );
    }
}


export default PrizeDialog;