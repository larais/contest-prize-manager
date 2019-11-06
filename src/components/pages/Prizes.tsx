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
import { IPrize } from '../../data/Model';
import { prizeRepository } from '../../data/Repository';
import PrizeDialog from '../ErrorDialog';
import ErrorDialog from '../ErrorDialog';

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
    addPrize: {
      marginRight: theme.spacing(1),
    },
    contentWrapper: {
      margin: '40px 16px',
    },
    button: {
      margin: theme.spacing(1),
    },
  });


interface IPrizeProps extends WithStyles<typeof styles> {
}

interface IPrizeState {
  prizes: IPrize[];
  dialogOpen: boolean;
  dialogIsEdit: boolean;
  dialogEditPrize?: IPrize;
  errorState: boolean;
}

class Prizes extends Component<IPrizeProps, IPrizeState> {
  constructor(props: IPrizeProps) {
    super(props);
    
    this.state = {
      prizes: [],
      dialogOpen: false,
      dialogIsEdit: false,
      errorState: false
    }
  }

  componentDidMount() {
    try {
      prizeRepository.getAll().then((result) => {
        this.setState({
          prizes: result
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

    let prize: IPrize | undefined = this.state.prizes.find((value) => { return value._id === rowId });

    if (!prize) {
      return;
    }

    this.setState({
      dialogOpen: true,
      dialogIsEdit: true,
      dialogEditPrize: prize
    });
  }

  deleteActionClick = (rowId: string, e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      prizeRepository.remove(rowId).then(() => {
        this.setState({
          prizes: this.state.prizes.filter(p => p._id !== rowId)
        });
      });
    } catch (e) {
      this.setState({ errorState: true });
    }
  }

  handlePrizeAdded = (prize: IPrize) => {
    try {
      prizeRepository.add(prize)
        .then(() => {
          this.setState({ dialogOpen: false });
        });
    } catch (e) {
      this.setState({ dialogOpen: false, errorState: true });
    }
    this.setState({
      dialogOpen: false,
      prizes: this.state.prizes.concat(prize)
    })
  }

  handlePrizeUpdated = (prize: IPrize) => {
    try {
      prizeRepository.get(prize._id)
        .then((p) => {
          p.title = prize.title;
          p.capacity = prize.capacity;
          p.minAge = prize.minAge;
          p.maxAge = prize.maxAge;
          p.location = prize.location;
          
          prizeRepository.update(p)
            .then(() => {
              this.setState({ dialogOpen: false });
            })
        })
    } catch (e) {
      this.setState({ dialogOpen: false, errorState: true });
    }


    this.setState({
      dialogOpen: false,
      prizes: this.state.prizes.map((item, i) => { return (item._id === prize._id) ? prize : item; })
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
              <Typography variant="h6">
                Prizes
                    </Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" className={this.props.classes.addPrize} onClick={this.addActionClick}>
                Add prize
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
              <TableCell>Capacity</TableCell>
              <TableCell>minAge</TableCell>
              <TableCell>maxAge</TableCell>
              <TableCell>location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.state.prizes.map((row: IPrize) => (
              <TableRow key={row._id}>
                <Hidden mdUp>
                  <TableCell component="th" scope="row">
                    {row._id}
                  </TableCell>
                </Hidden>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.capacity}</TableCell>
                <TableCell>{row.minAge}</TableCell>
                <TableCell>{row.maxAge}</TableCell>
                <TableCell>{row.location}</TableCell>
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

      <ErrorDialog open={this.state.errorState} text={"You need to reload the page."} />
    </Paper>
    )
  };
}

export default withStyles(styles)(Prizes);