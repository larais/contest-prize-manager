import React from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';
import CompareArrowIcon from '@material-ui/icons/CompareArrowsOutlined';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxWidth: 936,
      margin: 'auto',
      overflow: 'hidden',
      textAlign: "center"
    },
    searchBar: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
    searchInput: {
      fontSize: theme.typography.fontSize,
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
    }
  });

export interface ContentProps extends WithStyles<typeof styles> {}

function Content(props: ContentProps) {
  const { classes } = props;

  return (
    <Paper className={classes.paper}>
      <div>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<PeopleIcon />}
          href="/participants"
        >
          Participants
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AssignmentIcon />}
          href="/projects"
        >
          Projects
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<StarBorderIcon />}
          href="/prizes"
        >
          Prizes
        </Button>
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          startIcon={<CompareArrowIcon />}
          href="/board"
        >
          Attribution Board
        </Button>
      </div>
    </Paper>
  );
}

export default withStyles(styles)(Content);
