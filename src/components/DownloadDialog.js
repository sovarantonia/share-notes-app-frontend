import React, {useState} from "react";
import {Button, Dialog, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";
import {downloadNote} from "./api";
import {faCircleDown, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DownloadDialog = ({open, onClose, selectedNotesIds}) => {
    const [error, setError] = useState('');
    const [option, setOption] = useState('pdf');

    const handleChange = (e) => {
        setOption(e.target.value)
    }

    const handleDownloadNote = async () => {
        try {
            await downloadNote(selectedNotesIds, option)
            setError('')
            onClose();
        } catch (error) {
            setError('Error downloading the note')
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="download-dialog">

            <DialogTitle>Download Note(s)</DialogTitle>
            <Box sx={{px: 3, py: 2}}>
                {
                    error && (
                        <Typography color="error" id="errorMessage" aria-live="assertive">
                            {error}
                        </Typography>
                    )
                }
                <FormControl>
                    <FormLabel id="file-type" shrink={true}>Download as:</FormLabel>
                    <RadioGroup
                        aria-labelledby="file-type"
                        name="type"
                        onChange={handleChange}
                        value={option}
                        row
                    >
                        <FormControlLabel control={<Radio/>} label="Pdf" value="pdf"/>
                        <FormControlLabel control={<Radio/>} label="Document" value="docx"/>
                        <FormControlLabel control={<Radio/>} label="Text" value="txt"/>
                    </RadioGroup>
                </FormControl>

                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3}}>
                    <Button id="downloadButton" onClick={handleDownloadNote} variant="contained" sx={{
                        border: '1px solid #2db34b',
                        backgroundColor: '#2db34b',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#218838',
                            borderColor: '#218838',
                            color: '#fff',
                        },
                    }}>
                        <FontAwesomeIcon icon={faCircleDown}/>Download
                    </Button>
                    <Button id="cancelButton" onClick={onClose} variant="outlined" color="secondary">
                        <FontAwesomeIcon icon={faTimes}/> Cancel
                    </Button>
                </Box>

            </Box>

        </Dialog>
    );
};
export default DownloadDialog;