import {Button, Dialog, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import {deleteNote} from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEraser, faTimes} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DeleteNoteDialog = ({open, onClose, noteId, onUpdate}) => {
    const [error, setError] = useState('');

    const handleDeleteNote = async () => {
        try {
            await deleteNote(noteId);
            alert('Note was deleted')
            setError('')
            onUpdate();

        } catch (error) {
            setError('Error deleting the note');
        }
    }

    return (
        <Dialog open={open} onClose={onClose} >
                <DialogTitle>Delete Note</DialogTitle>
            <Box sx={{px: 3, py: 2}}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}
                <Typography>This action cannot be undone.</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button id="deleteNoteButton" onClick={handleDeleteNote} variant="contained"  sx={{
                        border: '1px solid #9a1308',
                        backgroundColor: '#9a1308',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#771810',
                            borderColor: '#771810',
                            color: '#fff',
                        },
                    }}>
                        <FontAwesomeIcon icon={faEraser}/> Delete
                    </Button>

                    <Button id="cancelButton" onClick={onClose} variant="outlined" color="primary">
                        <FontAwesomeIcon icon={faTimes}/> Cancel
                    </Button>

                </Box>

            </Box>

        </Dialog>
    );
};

export default DeleteNoteDialog;

