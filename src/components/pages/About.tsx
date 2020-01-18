import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Link, Grid } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

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
    contentWrapper: {
      margin: '40px 16px',
    },
  });

export interface AboutProps extends WithStyles<typeof styles> {}

function About(props: AboutProps) {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.titleBar} position="static" color="default" elevation={0}>
        <Toolbar>
        <Grid container spacing={2} alignItems="center">
            <Grid item>
              <InfoIcon className={classes.block} color="inherit" />
            </Grid>
            <Grid item>
            <Typography variant="h6">  
              About
            </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        
        <Typography color="textSecondary" align="center">
          Code is on <Link href="https://github.com/larais/contest-prize-manager" target="_blank">
          GitHub
          </Link>
        </Typography>     
      </div>
    </Paper>
  );
}

export default withStyles(styles)(About);