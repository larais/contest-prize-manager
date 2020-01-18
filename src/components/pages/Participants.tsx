import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, TableHead, Table, TableBody, Grid, Button, Tooltip, IconButton, Hidden, Icon } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import PeopleIcon from '@material-ui/icons/People';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import CheckIcon from '@material-ui/icons/Check';
import { IParticipant } from '../../data/Model';
import { participantRepository, projectRepository } from '../../data/Repository';
import ParticipantDialog from '../dialogs/ParticipantDialog';
import ErrorDialog from '../dialogs/ErrorDialog';

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

interface IParticipantProps extends WithStyles<typeof styles> {
}

interface IParticipantState {
  participants: IParticipant[];
  dialogOpen: boolean;
  dialogIsEdit: boolean;
  dialogEditParticipant?: IParticipant;
  errorState: boolean;
}

class Participants extends Component<IParticipantProps, IParticipantState> {
  constructor(props: IParticipantProps) {
    super(props);

    this.state = {
      participants: [],
      dialogOpen: false,
      dialogIsEdit: false,
      errorState: false
    }
  }

  componentDidMount() {
    try {
      participantRepository.getAll().then((result) => {
        this.setState({
          participants: result
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

    let participant: IParticipant | undefined = this.state.participants.find((value) => { return value._id === rowId });

    if (!participant) {
      return;
    }

    this.setState({
      dialogOpen: true,
      dialogIsEdit: true,
      dialogEditParticipant: participant
    });
  }

  deleteActionClick = (rowId: string, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      participantRepository.remove(rowId).then(() => {
        this.setState({
          participants: this.state.participants.filter(p => p._id !== rowId)
        });

        projectRepository.getAll().then((projects) => {
          projects.forEach(async (project) => {
            if (project.participants.includes(rowId)) {
              project.participants = project.participants.filter(p => p !== rowId);
              await projectRepository.update(project);
            }
          })
        });

      });
    } catch (e) {
      this.setState({ errorState: true });
    }
  }

  handleParticipantAdded = (participant: IParticipant) => {
    try {
      participantRepository.add(participant)
        .then(() => {
          this.setState({ dialogOpen: false });
        });
    } catch (e) {
      this.setState({ dialogOpen: false, errorState: true });
    }
    this.setState({
      dialogOpen: false,
      participants: this.state.participants.concat(participant)
    })
  }

  handleParticipantUpdated = (participant: IParticipant) => {

    try {
      participantRepository.get(participant._id)
        .then((p) => {
          p.birthdate = participant.birthdate;
          p.firstName = participant.firstName;
          p.lastName = participant.lastName;
          p.hasPassport = participant.hasPassport;

          participantRepository.update(p)
            .then(() => {
              this.setState({ dialogOpen: false });
            })
        })
    } catch (e) {
      this.setState({ dialogOpen: false, errorState: true });
    }


    this.setState({
      dialogOpen: false,
      participants: this.state.participants.map((item, i) => { return (item._id === participant._id) ? participant : item; })
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
              <PeopleIcon className={this.props.classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={this.props.classes.addUser} onClick={this.addActionClick}>
                Add participant
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
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Birthdate</TableCell>
              <TableCell align="center">Passport?</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.participants.map((row: IParticipant) => (
              <TableRow key={row._id}>
                <Hidden mdUp>
                  <TableCell component="th" scope="row">
                    {row._id}
                  </TableCell>
                </Hidden>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{new Date(row.birthdate).toLocaleDateString("lu-LU")}</TableCell>
                <TableCell align="center">
                  {
                    (row.hasPassport) ? <Icon><CheckIcon /></Icon> : <Icon><NotInterestedIcon /></Icon>
                  }

                </TableCell>
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
      <ParticipantDialog open={this.state.dialogOpen} editMode={this.state.dialogIsEdit} editParticipant={this.state.dialogEditParticipant} onAdded={this.handleParticipantAdded} onUpdated={this.handleParticipantUpdated} onClosed={this.handleDialogClosed} />
      <ErrorDialog open={this.state.errorState} text={"You need to reload the page."} />
    </Paper>
    )
  };
}

export default withStyles(styles)(Participants);