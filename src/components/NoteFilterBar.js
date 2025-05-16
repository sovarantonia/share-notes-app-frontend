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
        <Box
            mb={3}
            sx={{
                p: 2,
                backgroundColor: '#f9f9f9',
                borderRadius: 3,
                mb: 3,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            }}
        >
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
                        renderInput={(params) => <TextField {...params} label="Filter by tag"/>}
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

                <Grid item xs={12} md={5}>
                    <Box display="flex" gap={2} alignItems="center">
                        {[{label: 'From', value: fromDate, onChange: onFromDateChange},
                            {label: 'To', value: toDate, onChange: onToDateChange}].map(({label, value, onChange}) => (
                            <Box
                                key={label}
                                flex={1}
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
                                <FormLabel component="legend" sx={{mb: 0.5}}>
                                    {label}
                                </FormLabel>
                                <DatePicker
                                    selected={value}
                                    onChange={onChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                        },
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText={`Select ${label.toLowerCase()} date`}
                                />
                            </Box>
                        ))}
                    </Box>
                </Grid>

                <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button variant="outlined" onClick={onResetFilters}>
                        Reset Filters
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}
export default NoteFilterBar;