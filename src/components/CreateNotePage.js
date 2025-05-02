import Sidebar from "./Sidebar";
import React, {useEffect} from "react";
import {useState} from 'react';
import DatePicker from "react-datepicker";
import {note, getTagsByUser} from "./api";
import "react-datepicker/dist/react-datepicker.css";
import {useUser} from "./userContext";
import 'react-dropdown/style.css';
import '../resources/create-note.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {format} from "date-fns";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Autocomplete, Button, Chip, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";

const CreateNotePage = ({onLogout}) => {
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [date, setDate] = useState(new Date());
    const [grade, setGrade] = useState(1);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState('');

    const {user} = useUser();

    const options = Array.from({ length: 10 }, (_, i) => ({
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
            }catch(error) {
                setError("Failed to fetch tags");
            }
        }
        fetchTags();
    }, [user.userId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = format(date, 'dd-MM-yyyy');
        if (!title) {
            setError('Enter a title');
            return;
        }

        try {
            await note(user.userId, title, text, formattedDate, grade, selectedTags);

            alert('Note was created');
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
            setError('Only .txt files are supported.');
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError('File is too large. Maximum allowed size is 1 MB.');
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

    const capitalizeWords = (text) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase());

    return (
        <div className="create-note-page">
            <Sidebar onLogout={onLogout}/>
            <div className="main-content">
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
                >
                    {error && (
                        <Typography color="error" id="errorMessage" aria-live="assertive">
                            {error}
                        </Typography>
                    )}

                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        id="fileUpload"
                        style={{ marginBottom: '1rem' }}
                    />

                    {uploadedFileName && (
                        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                            Loaded from file: {uploadedFileName}
                        </Typography>
                    )}

                    <TextField
                        id="titleInput"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
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
                        id="contentInput"
                        label="Content"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        multiline
                        rows={4}
                        className="content-input"
                    />

                    <div>
                        <label htmlFor="datePicker" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Date:
                        </label>
                        <DatePicker
                            id="datePicker"
                            selected={date}
                            onChange={(date) => setDate(date)}
                            dateFormat="dd-MM-yyyy"
                            maxDate={new Date()}
                            calendarStartDay={1}
                            className="date-picker"
                        />
                    </div>

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
                        startIcon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Submit
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default CreateNotePage;