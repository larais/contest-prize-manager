import React, { Component } from "react";
import { Button, FormGroup, Slider } from '@material-ui/core';
import { IPrize, IProject } from '../../data/Model';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

interface IPrizeDialogProps {
    editMode: boolean;
    editPrize?: IPrize;
    open: boolean;
    onAdded(project: IPrize): void;
    onUpdated(project: IPrize): void;
    onClosed(): void;
}

interface IPrizeDialogState {
    dialogTitle: string;
    dialogCapacity: number;
    dialogMinAge: number;
    dialogMaxAge: number;
    dialogLocation: string;
    dialogProjects: IProject[];
    loading: boolean;
    dialogTitleError: boolean;
    dialogLocationError: boolean;
}

class PrizeDialog extends Component<IPrizeDialogProps, IPrizeDialogState> {
    constructor(props: IPrizeDialogProps) {
        super(props);

        this.state = {
            dialogTitle: "",
            dialogCapacity: -1,
            dialogMinAge: 11,
            dialogMaxAge: 21,
            dialogLocation: "",
            dialogProjects: [],
            loading: false,
            dialogTitleError: false,
            dialogLocationError: false
        }
    }

    componentDidUpdate = (prevProps: IPrizeDialogProps) => {
        if (prevProps.open !== this.props.open && this.props.open) {
          if (this.props.editMode && this.props.editPrize) {
            this.setState({
              loading: false,
              dialogTitle: this.props.editPrize.title,
              dialogCapacity: this.props.editPrize.capacity,
              dialogMinAge: this.props.editPrize.minAge,
              dialogMaxAge: this.props.editPrize.maxAge,
              dialogLocation: this.props.editPrize.location,
              dialogTitleError: false,
              dialogLocationError: false
            });

        } else if (!this.props.editMode) {
            this.setState({
              loading: false,
              dialogTitle: "",
              dialogCapacity: -1,
              dialogMinAge: 11,
              dialogMaxAge: 21,
              dialogLocation: "",
              dialogTitleError: false,
              dialogLocationError: false
            });
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
    
        if (this.props.editMode && this.props.editPrize) {
          let prize = this.props.editPrize;
          prize.title = this.state.dialogTitle;
          prize.capacity = this.state.dialogCapacity;
          prize.minAge = this.state.dialogMinAge;
          prize.maxAge = this.state.dialogMaxAge;
          prize.location = this.state.dialogLocation;
          prize.projects = this.state.dialogProjects.map(p => p._id);
          
          this.props.onUpdated(prize);
        } else {
          let prize: IPrize = {
            _id: '',
            title: this.state.dialogTitle,
            capacity: this.state.dialogCapacity,
            minAge: this.state.dialogMinAge,
            maxAge: this.state.dialogMaxAge,
            location: this.state.dialogLocation,
            projects: this.state.dialogProjects.map(p => p._id)
          }
        
          this.props.onAdded(prize);
        }
      }

    checkInputInvalid(): boolean {
        let teError = this.state.dialogTitle === "";
        let leError = this.state.dialogLocation === "";
        this.setState({ dialogTitleError: teError });
        this.setState({ dialogLocationError: leError });
        return teError || leError;
      }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.handleClose} fullWidth={true} maxWidth={"xs"}>
                <DialogTitle id="form-dialog-title">{this.props.editMode ? "Edit Prize" : "Add Prize"}</DialogTitle>
                <DialogContent>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input id="title" autoFocus value={this.state.dialogTitle} onChange={(e) => this.setState({ dialogTitle: e.target.value })} error={this.state.dialogTitleError} />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="location">Location</InputLabel>
                        <Input id="location" value={this.state.dialogLocation} onChange={(e) => this.setState({ dialogLocation: e.target.value })} error={this.state.dialogLocationError} />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="capacity">Capacity</InputLabel>
                        <Input id="capacity" value={this.state.dialogCapacity} onChange={(e) => this.setState({ dialogCapacity: parseInt(e.target.value) })} />
                    </FormControl>
                    <FormControl>
                        <InputLabel htmlFor="min-max-age">Age Range</InputLabel>
                        <Slider
                            id="min-max-age"
                            value={[this.state.dialogMinAge, this.state.dialogMaxAge]}
                            valueLabelDisplay="on"
                            aria-labelledby="range-slider-always"
                            onChange={(e) => console.log(e)}
                        />
                    </FormControl>
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


export default PrizeDialog;