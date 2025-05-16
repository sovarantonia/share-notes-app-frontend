import React, {useEffect, useState} from "react";
import {getNoteById, getTagsByUser, updateNote} from "./api";
import {
    Autocomplete,
    Button, Chip,
    Dialog, DialogTitle,
    FormControl,
    InputLabel,
    MenuItem, Select,
    TextField
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const UpdateNoteDialog = ({open, onClose, noteId, onUpdate, showSnackbar}) => {
        const [note, setNote] = useState(null);
        const [grade, setGrade] = useState('');
        const options = Array.from({length: 10}, (_, i) => ({
            label: `${i + 1}`,
            value: i + 1
        }));
        const [selectedTags, setSelectedTags] = useState([]);
        const [tagOptions, setTagOptions] = useState([]);
        const [error, setError] = useState('');

        useEffect(() => {
            if (open && noteId) {
                const fetchNote = async () => {
                    try {
                        const data = await getNoteById(noteId);
                        const userTags = await getTagsByUser();
                        setNote(data);
                        setGrade(data.grade);
                        setSelectedTags(data.tags.map(tag => tag.name));
                        setTagOptions(userTags.map(tag => tag.name));
                    } catch (err) {
                        setError('Failed to fetch note');
                    }
                };

                fetchNote();
            }
        }, [open, noteId]);

        const handleGradeChange = (event) => {
            setGrade(event.target.value);
        };

        const handleUpdate = async () => {
            if (note) {
                try {
                    await updateNote(noteId,
                        note.userId,
                        note.title,
                        note.text,
                        note.date,
                        grade,
                        selectedTags
                    );
                    setError('')
                    onUpdate();
                    showSnackbar('Note updated successfully!', 'success');
                    onClose();
                } catch (err) {
                    setError('Failed to update note');
                    showSnackbar('Failed to update the note!', 'error');
                }
            }
        };

        const capitalizeWords = (text) =>
            text.replace(/\b\w/g, (char) => char.toUpperCase());

        if (!note) return null;

        return (
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="update-dialog">
                <DialogTitle>Edit Note</DialogTitle>

                <Box sx={{px: 3, py: 2}}>
                    {error && (
                        <Typography color="error" id="errorMessage" aria-live="assertive" sx={{mb: 2}}>
                            {error}
                        </Typography>
                    )}

                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        <TextField
                            label="Title"
                            value={note.title}
                            onChange={(e) => setNote({...note, title: e.target.value})}
                            fullWidth
                            id="title"
                        />

                        <Autocomplete
                            multiple
                            freeSolo
                            options={tagOptions}
                            value={selectedTags}
                            onChange={(event, newValue) => {
                                const normalized = [...new Set(newValue.map(tag =>
                                    capitalizeWords(tag.trim())
                                ))];
                                setSelectedTags(normalized);
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip variant="outlined" label={option} {...getTagProps({index})} />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tags"
                                    placeholder="Type or select tags"
                                    id="tagsInput"
                                />
                            )}
                        />

                        <TextField
                            label="Content"
                            value={note.text}
                            onChange={(e) => setNote({...note, text: e.target.value})}
                            fullWidth
                            id="content"
                            multiline
                            rows={4}
                        />

                        <TextField
                            label="Date"
                            value={note.date}
                            InputProps={{readOnly: true}}
                            fullWidth
                            id="date"
                        />

                        <FormControl fullWidth>
                            <InputLabel>Grade</InputLabel>
                            <Select
                                value={grade}
                                onChange={handleGradeChange}
                                id="grade"
                            >
                                {options.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button
                                onClick={handleUpdate}
                                variant="contained"
                                id="updateButton"
                                sx={{
                                    border: '1px solid #2db34b',
                                    backgroundColor: '#2db34b',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#218838',
                                        borderColor: '#218838',
                                        color: '#fff',
                                    },
                                }}
                            >
                                <FontAwesomeIcon icon={faSave} style={{marginRight: 8}}/>
                                Update
                            </Button>

                            <Button onClick={onClose} variant="outlined" color="primary" id="cancelButton">
                                <FontAwesomeIcon icon={faTimes}/> Close
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </Dialog>
        )
            ;
    }
;

export default UpdateNoteDialog;