import Sidebar from "./Sidebar";
import React, {useEffect} from "react";
import {useState} from 'react';
import DatePicker from "react-datepicker";
import {note, getTagsByUser} from "./api";
import "react-datepicker/dist/react-datepicker.css";
import {useUser} from "./userContext";
import 'react-dropdown/style.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faUpload} from "@fortawesome/free-solid-svg-icons";
import {format} from "date-fns";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import {
    Alert,
    Autocomplete,
    Button,
    Chip,
    FormControl,
    FormLabel,
    InputLabel,
    MenuItem,
    Select, Snackbar,
    Stack,
    TextField
} from "@mui/material";

const CreateNotePage = ({onLogout}) => {
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [grade, setGrade] = useState(1);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const [titleError, setTitleError] = useState('');
    const [touched, setTouched] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const {user} = useUser();

    const options = Array.from({length: 10}, (_, i) => ({
        label: `${i + 1}`,
        value: i + 1
    }));

    const MAX_FILE_SIZE = 1_000_000; // 1 MB limit

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getTagsByUser();
                const tagNames = response.map(tag => tag.name);
                setTagOptions(tagNames);
            } catch (error) {
                setError("Failed to fetch tags");
            }
        }
        fetchTags();
    }, [user.userId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = format(date, 'dd-MM-yyyy');
        if (!title.trim()) {
            setError('Enter a title');
            return;
        }

        try {
            await note(user.userId, title, text, formattedDate, grade, selectedTags);

            setOpenSnackbar(true);
            setTitle('');
            setText('');
            setDate(new Date());
            setGrade(1);
            setSelectedTags([]);
            setError('');
            setUploadedFileName('');

        } catch (error) {
            setError('An unexpected error occurred.');
        }
    };

    const handleChange = (e) => {
        setGrade(Number(e.target.value)); // Convert value to integer
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.txt')) {
            alert('Only .txt files are supported.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert('File is too large. Maximum allowed size is 1 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            setText(fileContent);

            // Autofill title based on filename
            const baseName = file.name.replace(/\.[^/.]+$/, '');
            const formattedTitle = baseName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            setTitle(formattedTitle);

            setError('');
        };
        reader.onerror = () => {
            setError('Failed to read the file.');
        };

        reader.readAsText(file);
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);

        if (touched && !value.trim()) {
            setTitleError('Title is required');
        } else {
            setTitleError('');
        }
    };

    const handleTitleBlur = () => {
        setTouched(true);
        if (!title.trim()) {
            setTitleError('Title is required');
        }
    };

    const capitalizeWords = (text) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <Box sx={{display: 'flex'}}>
            <Box sx={{width: 250, flexShrink: 0}}>
                <Sidebar onLogout={onLogout}/>
            </Box>
            <Box sx={{flexGrow: 1, p: 3}}>
                <Typography variant="h4" gutterBottom>
                    Create Note
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    className="note-form"
                    id="noteForm"
                    sx={{display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600}}
                >
                    {error && (
                        <Typography color="error" id="errorMessage" aria-live="assertive">
                            {error}
                        </Typography>
                    )}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<FontAwesomeIcon icon={faUpload} />}
                            sx={{
                                borderColor: '#4a749f',
                                color: '#4a749f',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#e3f2fd',
                                    borderColor: '#4a749f',
                                },
                            }}
                        >
                            Upload .txt File
                            <input
                                type="file"
                                accept=".txt"
                                hidden
                                onChange={handleFileUpload}
                                id="fileUpload"
                            />
                        </Button>

                        {uploadedFileName && (
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                {uploadedFileName}
                            </Typography>
                        )}
                    </Stack>
                    <TextField
                        id="titleInput"
                        label="Title"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        required
                        error={!!titleError}
                        helperText={titleError}
                    />

                    <Autocomplete
                        multiple
                        freeSolo
                        options={tagOptions}              // array of strings
                        value={selectedTags}              // array of strings
                        onChange={(event, newValue) => {
                            const normalized = newValue.map(tag =>
                                capitalizeWords(tag.trim())
                            );
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
                        id="contentInput"
                        label="Content"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        multiline
                        rows={4}
                        className="content-input"
                    />


                    <FormLabel component="legend" sx={{mb: 0.5}}>
                        Date:
                    </FormLabel>
                    <Box
                        sx={{
                            borderRadius: 2,
                            overflow: 'hidden',
                            '& input': {
                                borderRadius: 2,
                                border: '1px solid #ccc',
                                padding: '10px',
                            },
                        }}
                    >
                    <DatePicker
                        id="datePicker"
                        selected={date}
                        onChange={(date) => setDate(date)}
                        dateFormat="dd-MM-yyyy"
                        maxDate={new Date()}
                        calendarStartDay={1}
                        className="date-picker"
                    />
                    </Box>


                    <FormControl required>
                        <InputLabel id="gradeDropdownLabel">Grade</InputLabel>
                        <Select
                            labelId="gradeDropdownLabel"
                            id="gradeDropdown"
                            value={grade}
                            label="Grade"
                            onChange={handleChange}
                        >
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        startIcon={<FontAwesomeIcon icon={faPlus}/>}
                    >
                        Submit
                    </Button>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={5000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{
                        width: '100%',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(45,179,75,0.27)',
                    }}>
                        Note created successfully!
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default CreateNotePage;