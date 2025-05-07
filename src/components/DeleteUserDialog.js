import React from 'react';

import '../resources/user-profile.css'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const ConfirmDeleteDialog = ({isOpen, onClose, onConfirm}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description">
            <DialogTitle id="confirm-dialog-title">Confirm Account Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">This action cannot be undone.</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onConfirm} autoFocus color="error">Yes, Delete</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteDialog;