import {useUser} from "./userContext";
import Sidebar from "./Sidebar";
import React, {useEffect, useState} from "react";
import {getTagsByUser, searchNotes} from "./api";
import {debounce} from 'lodash';
import {Button, Card, CardActions, CardContent, Checkbox, Chip, FormControlLabel, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DownloadDialog from "./DownloadDialog";
import UpdateNoteDialog from "./UpdateNoteDialog";
import DeleteNoteDialog from "./DeleteNoteDialog";
import ShareDialog from "./ShareDialog";
import NoteFilterBar from "./NoteFilterBar";
import {format} from "date-fns";

const ViewNotes = () => {
    const {logout} = useUser();
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [grade, setGrade] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [tagOptions, setTagOptions] = useState([]);

    const [selectedNoteIds, setSelectedNoteIds] = useState([]);

    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);

    const handleLogout = () => {
        logout();
    };

    const fetchNotes = async (titleValue, tagValue, gradeValue, from, to) => {
        try {
            const data = await searchNotes(titleValue, tagValue, gradeValue, from, to);
            setNotes(data);
        } catch (error) {
            setError('Error fetching notes:');
        }
    };

    const debouncedFetchNotes = debounce((titleValue, tagValue, gradeValue, from, to) => {
        const formattedTo = to ? format(to, 'dd-MM-yyyy') : null;
        const formattedFrom = from ? format(from, 'dd-MM-yyyy') : null;
        fetchNotes(titleValue || null,
            tagValue || null,
            gradeValue || null,
            formattedFrom,
            formattedTo);
    }, 300);

    useEffect(() => {
        const formattedTo = toDate ? format(toDate, 'dd-MM-yyyy') : null;
        const formattedFrom = fromDate ? format(fromDate, 'dd-MM-yyyy') : null;
        fetchNotes(title || null,
            tag || null,
            grade || null,
            formattedFrom,
            formattedTo);

        const fetchTags = async () => {
            try {
                const tags = await getTagsByUser(); // if applicable
                setTagOptions(tags.map(tag => tag.name));
            } catch (err) {
                setError('Failed to fetch tags');
            }
        };

        fetchTags();
    }, []);

    const handleTitleChange = (e) => {
        const titleValue = e.target.value;
        setTitle(titleValue);
        debouncedFetchNotes(titleValue, tag, grade, fromDate, toDate);
    };

    const handleTagChange = (newTag) => {
        setTag(newTag || '');
        debouncedFetchNotes(title, newTag || '', grade, fromDate, toDate);
    };

    const handleGradeChange = (e) => {
        const gradeValue = e.target.value ? parseInt(e.target.value, 10) : '';
        setGrade(gradeValue);
        debouncedFetchNotes(title, tag, gradeValue, fromDate, toDate);
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        debouncedFetchNotes(title, tag, grade, date, toDate);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
        debouncedFetchNotes(title, tag, grade, fromDate, date);
    };

    const handleResetFilters = () => {
        setTitle('');
        setTag('');
        setGrade('');
        setFromDate(null);
        setToDate(null);

        fetchNotes(null, null, null, null, null);
    };

    const handleCheckboxChange = (noteId) => {
        setSelectedNoteIds((prev) =>
            prev.includes(noteId)
                ? prev.filter(id => id !== noteId) // remove if already selected
                : [...prev, noteId]               // add if not selected
        );
    };

    const handleOpenDialog = (noteId, dialogType) => {
        setSelectedNoteId(noteId);
        setOpen(true);
        setActiveDialog(dialogType);
    };

    const handleCloseDialog = () => {
        setOpen(false); // Close the dialog
        setActiveDialog(null);
    };

    const onUpdate = () => {
        const formattedTo = toDate ? format(toDate, 'dd-MM-yyyy') : null;
        const formattedFrom = fromDate ? format(fromDate, 'dd-MM-yyyy') : null;
        fetchNotes(title || null,
            tag || null,
            grade || null,
            formattedFrom,
            formattedTo);
        handleCloseDialog();
    }


    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f4f9' }}>
            {/* Sidebar with fixed width */}
            <Box sx={{ width: 250, flexShrink: 0 }}>
                <Sidebar onLogout={handleLogout} />
            </Box>

            {/* Main content with padding and full width */}
            <Box className="main-content" sx={{ flexGrow: 1, p: 4 }}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive">
                        {error}
                    </Typography>
                )}

                <NoteFilterBar
                    title={title}
                    tag={tag}
                    tagOptions={tagOptions}
                    grade={grade}
                    fromDate={fromDate}
                    toDate={toDate}
                    onTitleChange={handleTitleChange}
                    onTagChange={handleTagChange}
                    onGradeChange={handleGradeChange}
                    onFromDateChange={handleFromDateChange}
                    onToDateChange={handleToDateChange}
                    onResetFilters={handleResetFilters}
                />

                {/* Notes grid */}
                <Grid container spacing={2}>
                    {notes.map(note => (
                        <Grid item xs={12} sm={6} md={4} key={note.id}>
                            <Card>
                                <CardContent>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedNoteIds.includes(note.id)}
                                                onChange={() => handleCheckboxChange(note.id)}
                                            />
                                        }
                                        label={note.title}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {note.date} — Grade: {note.grade}
                                    </Typography>
                                    <Box sx={{ my: 1 }}>
                                        {note.tags.map(tag => (
                                            <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 0.5 }} />
                                        ))}
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {note.text.slice(0, 100)}...
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleOpenDialog(note.id, "update-dialog")}>Edit</Button>
                                    <Button size="small" onClick={() => handleOpenDialog(note.id, "share-dialog")}>Share</Button>
                                    <Button size="small" onClick={() => handleOpenDialog(note.id, "delete-dialog")}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Download Actions */}
                {selectedNoteIds.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ mr: 2, display: 'inline-block' }}>
                            {selectedNoteIds.length} note{selectedNoteIds.length > 1 ? 's' : ''} selected
                        </Typography>
                        <Button variant="contained" onClick={() => setOpenDownloadDialog(true)}>
                            Download Selected
                        </Button>
                        <DownloadDialog
                            open={openDownloadDialog}
                            onClose={() => setOpenDownloadDialog(false)}
                            selectedNotesIds={selectedNoteIds}
                        />
                        <Button variant="text" onClick={() => setSelectedNoteIds([])} sx={{ ml: 2 }}>
                            Clear Selection
                        </Button>
                    </Box>
                )}

                {/* Dialogs */}
                {selectedNoteId !== null && (
                    <>
                        <UpdateNoteDialog
                            open={open && activeDialog === "update-dialog"}
                            onClose={handleCloseDialog}
                            noteId={selectedNoteId}
                            onUpdate={onUpdate}
                        />
                        <DeleteNoteDialog
                            open={open && activeDialog === "delete-dialog"}
                            onClose={handleCloseDialog}
                            noteId={selectedNoteId}
                            onUpdate={onUpdate}
                        />
                        <ShareDialog
                            open={open && activeDialog === "share-dialog"}
                            onClose={handleCloseDialog}
                            noteId={selectedNoteId}
                        />
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ViewNotes;