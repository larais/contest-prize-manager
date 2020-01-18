import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface IErrorDialogProps {
    open: boolean;
    text: string;
}

class ErrorDialog extends Component<IErrorDialogProps, {}> {

    handleReload() {
        window.location.reload();
    }

    render() {
        return (
            <div>
                <Dialog open={this.props.open}>
                    <DialogTitle>{"There was an error!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText >
                            {this.props.text}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleReload} color="primary" autoFocus>
                            Reload page
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default ErrorDialog;