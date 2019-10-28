import React, { Component } from "react";
import { Button, FormGroup } from '@material-ui/core';
import { IParticipant } from '../data/Model';
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
  editParticipant?: IParticipant;
  open: boolean;
  onAdded(participant: IParticipant): void;
  onUpdated(participant: IParticipant): void;
  onClosed(): void;
}

interface IParticipantDialogState {
  dialogFirstName: string;
  dialogLastName: string;
  dialogBirthdate: Date;
  dialogHasPassport: boolean;
  loading: boolean;
  firstNameError: boolean;
  lastNameError: boolean;
}

class ParticipantDialog extends Component<IParticipantDialogProps, IParticipantDialogState> {

  constructor(props: IParticipantDialogProps) {
    super(props);

    this.state = {
      dialogBirthdate: new Date(),
      dialogFirstName: "",
      dialogHasPassport: false,
      dialogLastName: "",
      loading: false,
      firstNameError: false,
      lastNameError: false
    }
  }

  componentDidUpdate = (prevProps: IParticipantDialogProps) => {
    if (prevProps.open !== this.props.open && this.props.open) {
      if (this.props.editMode && this.props.editParticipant) {
        this.setState({
          loading: false,
          dialogBirthdate: new Date(this.props.editParticipant.birthdate),
          dialogFirstName: this.props.editParticipant.firstName,
          dialogHasPassport: this.props.editParticipant.hasPassport,
          dialogLastName: this.props.editParticipant.lastName,
          firstNameError: false,
          lastNameError: false
        });

      } else if (!this.props.editMode) {
        this.setState({
          loading: false,
          dialogBirthdate: new Date(),
          dialogFirstName: "",
          dialogHasPassport: false,
          dialogLastName: "",
          firstNameError: false,
          lastNameError: false
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

    if (this.props.editMode && this.props.editParticipant) {
      let participant = this.props.editParticipant;
      participant.birthdate = this.state.dialogBirthdate.toISOString();
      participant.firstName = this.state.dialogFirstName;
      participant.lastName = this.state.dialogLastName;
      participant.hasPassport = this.state.dialogHasPassport;

      this.props.onUpdated(participant);
    } else {
      let participant: IParticipant = {
        _id: '',
        firstName: this.state.dialogFirstName,
        lastName: this.state.dialogLastName,
        birthdate: this.state.dialogBirthdate.toISOString(),
        hasPassport: this.state.dialogHasPassport
      }

      this.props.onAdded(participant);
    }
  }

  checkInputInvalid(): boolean {
    let feError = this.state.dialogFirstName === "";
    let leError = this.state.dialogLastName === "";
    this.setState({ firstNameError: feError });
    this.setState({ lastNameError: leError });
    return feError || leError;
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={this.handleClose} fullWidth={true} maxWidth={"xs"}>
        <DialogTitle id="form-dialog-title">{this.props.editMode ? "Edit Participant" : "Add Participant"}</DialogTitle>
        <DialogContent>
          <FormGroup>
            <FormControl>
              <InputLabel htmlFor="firstname">First Name</InputLabel>
              <Input id="firstname" autoFocus defaultValue={this.state.dialogFirstName} onChange={(e) => this.setState({ dialogFirstName: e.target.value })} error={this.state.firstNameError} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="lastname">Last Name</InputLabel>
              <Input id="lastname" defaultValue={this.state.dialogLastName} onChange={(e) => this.setState({ dialogLastName: e.target.value })} error={this.state.lastNameError} />
            </FormControl>
            <FormControl>
              <InputLabel htmlFor="birthdate" shrink>Birthday</InputLabel>
              <Input id="birthdate" type="date" defaultValue={this.state.dialogBirthdate.toISOString().substr(0, 10)} onChange={(e) => this.setState({ dialogBirthdate: new Date(e.target.value) })} />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="jason" defaultChecked={this.state.dialogHasPassport} onChange={(e) => this.setState({ dialogHasPassport: e.target.checked })} />}
              label="Passport available"
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

export default ParticipantDialog;