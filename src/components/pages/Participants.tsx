import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TableCell, TableRow, TableHead, Table, TableBody, Grid, Button, Tooltip, IconButton } from '@material-ui/core';
import { participantRepository } from '../../data/Repository';
import RefreshIcon from '@material-ui/icons/Refresh';
import PeopleIcon from '@material-ui/icons/People';
import { IParticipant } from '../../data/Model';


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
  });

interface IParticipantProps extends WithStyles<typeof styles> {}

interface IParticipantState {
  participants: IParticipant[];
}

class Participants extends Component<IParticipantProps, IParticipantState> {
  constructor(props: IParticipantProps) {
    super(props);
    
    this.state = {
      participants: [],
    }
  }
  componentDidMount() {
    participantRepository.getAll().then((result) => {
      this.setState({
        participants: result,
      });
    });
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
                      <Button variant="contained" color="primary" className={this.props.classes.addUser}>
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
                      <TableCell>GUID</TableCell>
                      <TableCell align="right">First Name</TableCell>
                      <TableCell align="right">Last Name</TableCell>
                      <TableCell align="right">Birthdate</TableCell>
                      <TableCell align="right">Passport?</TableCell>
                      <TableCell align="right">X</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.participants.map((row:IParticipant) => (  
                      <TableRow key={row._id}>
                        <TableCell component="th" scope="row">
                          {row._id}
                        </TableCell>
                        <TableCell align="right">{row.firstName}</TableCell>
                        <TableCell align="right">{row.lastName}</TableCell>
                        <TableCell align="right">{row.birthdate}</TableCell>
                        <TableCell align="right"><Checkbox checked={row.hasPassport} disabled value="passport" color="primary"/></TableCell>
                        <TableCell align="right">X</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              </Paper>
    )
  };
}

export default withStyles(styles)(Participants);