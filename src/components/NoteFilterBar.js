import Box from "@mui/material/Box";
import {
    Autocomplete,
    Button,
    FormControl,
    FormLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import DatePicker from "react-datepicker";
import "../resources/note-filter-bar.css";

const NoteFilterBar = ({
                           title,
                           tag,
                           tagOptions,
                           grade,
                           fromDate,
                           toDate,
                           onTitleChange,
                           onTagChange,
                           onGradeChange,
                           onFromDateChange,
                           onToDateChange,
                           onResetFilters,
                       }) => {
    return (
    <Box mb={3} className="note-filter-bar">
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Search by title"
                    value={title}
                    onChange={onTitleChange}
                    fullWidth
                />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                    options={tagOptions}
                    value={tag}
                    onChange={(e, newValue) => onTagChange(newValue)}
                    renderInput={(params) => <TextField {...params} label="Filter by tag" />}
                    fullWidth
                    clearOnEscape
                />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                    <InputLabel>Grade</InputLabel>
                    <Select
                        value={grade}
                        onChange={onGradeChange}
                        displayEmpty
                        label="Grade"
                    >
                        <MenuItem value=""></MenuItem>
                        {[...Array(10)].map((_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
            <Box display="flex" gap={2} alignItems="center">
                <Box flex={1}>
                    <FormLabel component="legend" sx={{ mb: 0.5 }}>From</FormLabel>
                    <DatePicker
                        value={fromDate}
                        selected={fromDate}
                        onChange={onFromDateChange}
                        dateFormat="dd-MM-yyyy"
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Box>
                <Box flex={1}>
                    <FormLabel component="legend" sx={{ mb: 0.5 }}>To</FormLabel>
                    <DatePicker
                        value={toDate}
                        selected={toDate}
                        onChange={onToDateChange}
                        dateFormat="dd-MM-yyyy"
                        slotProps={{ textField: { fullWidth: true } }}
                    />
                </Box>
            </Box>
        </Grid>


        <div className="filter-actions">
                <Grid item xs={12} sm={6} md="auto">
                    <Button variant="outlined" onClick={onResetFilters}>
                        Reset Filters
                    </Button>
                </Grid>
            </div>

        </Grid>
    </Box>
);
}
export default NoteFilterBar;