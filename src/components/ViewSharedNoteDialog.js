import React, {useEffect, useState} from "react";
import {getNoteById} from "./api";
import {Button, Dialog, DialogTitle, TextField} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SharedNoteDialog = ({open, onClose, noteId, dialogType}) => {
    const [note, setNote] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && noteId) {
            const fetchNote = async () => {
                try {
                    const data = await getNoteById(noteId);
                    setNote(data);
                } catch (err) {
                    setError('Failed to fetch note');
                }
            };

            fetchNote();
        }
    }, [open, noteId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="update-dialog">
                <DialogTitle>{dialogType === "view-received-note" ? "Received Note" : "Sent Note"}</DialogTitle>
            <Box sx={{px: 3, py: 2}}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    {note && (
                        <>
                            <TextField
                                label="Title"
                                value={note.title}
                                aria-readonly={true}
                                fullWidth
                                id="title"
                            />
                            <TextField
                                label="Content"
                                value={note.text}
                                aria-readonly={true}
                                fullWidth
                                rows={4}
                                multiline
                                id="content"
                            />
                            <TextField
                                label="Date"
                                value={note.date}
                                InputProps={{
                                    readOnly: true
                                }}
                                fullWidth
                                id="date"
                            />
                            <TextField
                                label="Grade"
                                value={note.grade}
                                InputProps={{
                                    readOnly: true
                                }}
                                fullWidth
                                id="grade"
                            />
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button onClick={onClose} variant="contained" color="primary" id="closeButton">
                            <FontAwesomeIcon icon={faTimes}/> Close
                        </Button>
                    </Box>

                </Box>

            </Box>

        </Dialog>
    );
};

export default SharedNoteDialog;
