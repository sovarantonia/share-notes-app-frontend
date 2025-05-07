import React, {useEffect, useState} from "react";
import {getNoteById, getTagsByUser, updateNote} from "./api";
import {
    Autocomplete,
    Button, Chip,
    Dialog,
    FormControl,
    InputLabel,
    MenuItem, Select,
    TextField
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTimes} from "@fortawesome/free-solid-svg-icons";
import '../resources/update-note-dialog.css';

const UpdateNoteDialog = ({open, onClose, noteId, onUpdate}) => {
    const [note, setNote] = useState(null);
    const [grade, setGrade] = useState('');
    const options = Array.from({ length: 10 }, (_, i) => ({
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
                onClose();
            } catch (err) {
                setError('Failed to update note');
            }
        }
    };

    const capitalizeWords = (text) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase());

    if (!note) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" classname="update-dialog">
            <div className="dialog-content">
                <h2>Edit Note</h2>
                {error && <div className="error">{error}</div>}
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
                    options={tagOptions} // all user-defined tags from backend (array of strings)
                    value={selectedTags}
                    onChange={(event, newValue) => {
                        // Capitalize and de-duplicate entries
                        const normalized = [...new Set(newValue.map(tag =>
                            capitalizeWords(tag.trim())
                        ))];
                        setSelectedTags(normalized);
                    }}
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
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
                <div className="dialog-buttons">

                    <Button onClick={handleUpdate} variant="contained" color="primary" id="updateButton">
                        <FontAwesomeIcon icon={faSave}/> Update
                    </Button>

                    <Button onClick={onClose} variant="outlined" color="secondary" id="cancelButton">
                        <FontAwesomeIcon icon={faTimes}/> Cancel
                    </Button>

                </div>
            </div>
        </Dialog>
    );
};

export default UpdateNoteDialog;