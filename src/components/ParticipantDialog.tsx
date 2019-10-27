import React, { Component } from "react";
import { Button, FormGroup } from '@material-ui/core';
import { IParticipant } from '../data/Model';
import { participantRepository } from '../data/Repository';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

interface IParticipantDialogProps {
    editMode: boolean;
    editParticipant?: string;
    open: boolean;
    onAdded(participant: IParticipant): void;
    onUpdated(participant: IParticipant): void;
}

interface IParticipantDialogState {
    dialogOpen: boolean;
    dialogFirstName: string;
    dialogLastName: string;
    dialogBirthdate: Date;
    dialogHasPassport: boolean;
}

class ParticipantDialog extends Component<IParticipantDialogProps, IParticipantDialogState> {
    constructor(props: IParticipantDialogProps) {
        super(props);
        
        this.state = {
          dialogOpen: false,
          dialogBirthdate: new Date(),
          dialogFirstName: "",
          dialogHasPassport: false,
          dialogLastName: ""
        }
      } 
    componentDidUpdate = (prevProps : IParticipantDialogProps) => {
        if (prevProps.open !== this.props.open && this.props.open) {

            if (this.props.editMode && this.props.editParticipant) {
              participantRepository.get(this.props.editParticipant)
                .then((participant) => {
                  this.setState({
                    dialogOpen: true,
                    dialogBirthdate: new Date(participant.birthdate),
                    dialogFirstName: participant.firstName,
                    dialogHasPassport: participant.hasPassport,
                    dialogLastName: participant.lastName
                  });
                });
            } else if (!this.props.editMode) {
                this.setState({
                    dialogOpen: true,
                    dialogBirthdate: new Date(),
                    dialogFirstName: "",
                    dialogHasPassport: false,
                    dialogLastName: ""
                  });
            }
        }
    }

    handleClose = () => {
        this.setState({ dialogOpen: false })
      }
    
    handleSave = () => {
        if (this.props.editMode && this.props.editParticipant) {
            participantRepository.get(this.props.editParticipant)
            .then((p) => {
                p.birthdate = this.state.dialogBirthdate.toISOString();
                p.firstName = this.state.dialogFirstName;
                p.lastName = this.state.dialogLastName;
                p.hasPassport = this.state.dialogHasPassport;

                participantRepository.update(p)
                .then(() => {
                    this.setState({ dialogOpen: false });
                    this.props.onUpdated(p);
                })
            })
        } else {
            let participant: IParticipant = {
            _id: '',
            firstName: this.state.dialogFirstName,
            lastName: this.state.dialogLastName,
            birthdate: this.state.dialogBirthdate.toISOString(),
            hasPassport: this.state.dialogHasPassport
            }

            participantRepository.add(participant)
            .then(() => {
                this.setState({ dialogOpen: false })
                this.props.onAdded(participant);
            });
        }
    }

    render() {
        return (
            <Dialog open={this.state.dialogOpen} onClose={this.handleClose} fullWidth={true} maxWidth={"xs"}>
                <DialogTitle id="form-dialog-title">{ this.props.editMode ? "Edit Participant" : "Add Participant"}</DialogTitle>
                <DialogContent>
                  <FormGroup>
                    <FormControl>
                      <InputLabel htmlFor="firstname">First Name</InputLabel>
                      <Input id="firstname" autoFocus defaultValue={this.state.dialogFirstName} onChange={(e) => this.setState({ dialogFirstName: e.target.value })} />
                    </FormControl>
                    <FormControl>
                      <InputLabel htmlFor="lastname">Last Name</InputLabel>
                      <Input id="lastname" defaultValue={this.state.dialogLastName} onChange={(e) => this.setState({ dialogLastName: e.target.value })}/>
                    </FormControl>
                    <FormControl>
                      <InputLabel htmlFor="birthdate" shrink>Birthday</InputLabel>
                      <Input id="birthdate" type="date" defaultValue={this.state.dialogBirthdate.toISOString().substr(0,10)} onChange={(e) => this.setState({ dialogBirthdate: new Date(e.target.value) })}/>
                    </FormControl>
                  <FormControlLabel
                      control={<Checkbox value="jason" defaultChecked={this.state.dialogHasPassport} onChange={(e) => this.setState({ dialogHasPassport: e.target.checked })} />}
                      label="Passport available"
                    />
                  </FormGroup>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleSave} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
        );
    }
}

export default ParticipantDialog;