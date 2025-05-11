import React, {useState} from "react";
import {searchUserFriends, shareNote} from "./api";
import {debounce} from "lodash";
import DropdownInput from "./DropdownInput";
import {Button, Dialog, DialogTitle} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowUpRightFromSquare, faTimes} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const ShareDialog = ({open, onClose, noteId}) => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const getFriends = async (searchString) => {
        try {
            const data = await searchUserFriends(searchString);
            setFriends(data);
        } catch (error) {
            setError('Error retrieving the friend list')
        }
    }

    const debounceFriends = debounce((searchString) => {
        getFriends(searchString)
    }, 300);

    const shareNoteToFriend = async (noteId, receiverEmail) => {
        try {
            await shareNote(noteId, receiverEmail)
        } catch (error) {
            setError('Error sharing the note')
        }
    }

    const handleShareNote = (noteId) => {
        if (selectedUser) {
            const receiverEmail = selectedUser.email;
            shareNoteToFriend(noteId, receiverEmail)
            setError('')
            alert("Note was shared")
            onClose();
        } else {
            setError('Select a friend')
        }
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={false} PaperProps={{
            sx: {
                width: '700px',
                borderRadius: 2,
                p: 2
            }
        }} className="share-dialog">
            <DialogTitle>Share note</DialogTitle>
            <Box sx={{px: 3, py: 2}}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}
                <Typography sx={{ mb: 2 }}>
                    Send to:
                    <Box sx={{ mt: 1, maxWidth: 400 }}>
                        <DropdownInput options={friends} onSearch={debounceFriends} onSelect={setSelectedUser}/>
                    </Box>
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, ml: 'auto' }}>
                    <Button id="shareButton" onClick={() => handleShareNote(noteId)} variant="contained" sx={{
                        border: '1px solid #2db34b',
                        backgroundColor: '#2db34b',
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#218838',
                            borderColor: '#218838',
                            color: '#fff',
                        },
                    }}>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare}/>Send
                    </Button>
                    <Button id="cancelButton" onClick={onClose} variant="outlined" color="secondary">
                        <FontAwesomeIcon icon={faTimes}/> Cancel
                    </Button>
                </Box>

            </Box>

        </Dialog>

    )
}
export default ShareDialog;