import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
import { participantRepository } from '../../data/Repository';
import ParticipantDialog from '../ParticipantDialog';

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
  dialogEditId?: string;
}

class Participants extends Component<IParticipantProps, IParticipantState> {
  constructor(props: IParticipantProps) {
    super(props);

    this.state = {
      participants: [],
      dialogOpen: false,
      dialogIsEdit: false
    }
  } 
  
  componentDidMount() {
    participantRepository.getAll().then((result) => {
      console.log(result);
      this.setState({
        participants: result
      });
    });
  }

  addActionClick = () => {
    this.setState({
      dialogOpen: true,
      dialogIsEdit: false
    });
  }

  handleParticipantAdded = (participant: IParticipant) => {
    this.setState({ 
      dialogOpen: false,
      participants: this.state.participants.concat(participant)
    })
  }

  handleParticipantUpdated = (participant: IParticipant) => {
    this.setState({ 
      dialogOpen: false,
      participants:this.state.participants.map((item, i) => { return (item._id === participant._id) ? participant : item; }) })
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
      dialogEditId: rowId
    });
  }

  deleteActionClick = (rowId: string, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("Delete event triggered for ID %s", rowId);
    console.log(e);
    participantRepository.remove(rowId).then(() => {
      console.log("Deletion was a success!");
      this.setState({
        participants: this.state.participants.filter( p => p._id !== rowId)
      });
    }) //TODO: Should probably handle exceptions :)
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
                    <Typography variant="h6">  
                    Participants
                    </Typography>
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
                    {this.state.participants.map((row:IParticipant) => (  
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
                            (row.hasPassport)?<Icon><CheckIcon /></Icon>:<Icon><NotInterestedIcon /></Icon>
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
              <ParticipantDialog open={this.state.dialogOpen} editMode={this.state.dialogIsEdit} editParticipant={this.state.dialogEditId} onAdded={this.handleParticipantAdded} onUpdated={this.handleParticipantUpdated} />
              </Paper>
    )
  };
}

export default withStyles(styles)(Participants);