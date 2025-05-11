import {useUser} from "./userContext";
import React, {useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import {getReceivedSharedNotes, getSentSharedNotes, getUserFriends} from "./api";
import {debounce} from "lodash";
import {
    Button, Card, CardActions,
    CardContent, Checkbox,
    FormControlLabel, Grid, Tab,
    Tabs
} from "@mui/material";

import DropdownInput from "./DropdownInput";
import SharedNoteDialog from "./ViewSharedNoteDialog";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DownloadDialog from "./DownloadDialog";

const SharesPage = () => {
    const {logout} = useUser();
    const [error, setError] = useState('');
    const [sentShares, setSentShares] = useState([])
    const [receivedShares, setReceivedShares] = useState([])
    const [userFriendList, setUserFriendList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedReceivedNotes, setSelectedReceivedNotes] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [activeDialog, setActiveDialog] = useState(null);
    const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

    const handleLogout = () => {
        logout();
    };


    const fetchSentShares = async (receiverEmail) => {
        try {
            const data = await getSentSharedNotes(receiverEmail)
            setSentShares(data)
        } catch (error) {
            setError('Error retrieving the shared notes')
        }
    }

    const debounceSentShares = debounce((receiverEmail) => {
        fetchSentShares(receiverEmail)
    }, 300)

    const fetchReceivedShares = async (senderEmail) => {
        try {
            const data = await getReceivedSharedNotes(senderEmail)
            setReceivedShares(data)
            setError('')
        } catch (error) {
            setError('Error retrieving the shared notes')
        }
    }

    const debounceReceivedShares = debounce((senderEmail) => {
        fetchReceivedShares(senderEmail)
    }, 300)


    useEffect(() => {
        fetchSentShares('')
        fetchReceivedShares('')
        fetchUserFriends()
    }, []);

    const fetchUserFriends = async () => {
        try {
            const data = await getUserFriends();
            setUserFriendList(data)
            setError('')
        } catch (error) {
            setError('Error retrieving the friends')
        }
    }

    const handleOpenDialog = (noteId, dialogType) => {
        setSelectedNoteId(noteId);
        setOpen(true);
        setActiveDialog(dialogType);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setActiveDialog(null);
    };

    const handleCheckboxChange = (noteId) => {
        setSelectedReceivedNotes((prev) =>
            prev.includes(noteId)
                ? prev.filter(id => id !== noteId) // remove if already selected
                : [...prev, noteId]               // add if not selected
        );
    };

    const handleTabChange = (e, newValue) => {
        setActiveTab(newValue);
        setSelectedUser(null);
        setSelectedReceivedNotes([]); // clear checkbox selections

        if (newValue === 0) {
            fetchReceivedShares('');
        } else {
            fetchSentShares('');
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            <Box sx={{ width: 250, flexShrink: 0 }}>
                <Sidebar onLogout={handleLogout} />
            </Box>

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ maxWidth: 400, mb: 3 }}>
                    <DropdownInput
                        options={userFriendList || []}
                        value={selectedUser}
                        onSearch={(inputValue) => {
                            if (activeTab === 0) {
                                debounceReceivedShares(inputValue);
                            } else {
                                debounceSentShares(inputValue);
                            }
                        }}
                        onSelect={(user) => {
                            setSelectedUser(user);
                            if (user) {
                                if (activeTab === 0) {
                                    debounceReceivedShares(user.email);
                                } else {
                                    debounceSentShares(user.email);
                                }
                            } else {
                                if (activeTab === 0) {
                                    fetchReceivedShares('');
                                } else {
                                    fetchSentShares('');
                                }
                            }
                        }}
                    />
                </Box>

                <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="Received" />
                    <Tab label="Sent" />
                </Tabs>

                {activeTab === 0 && (
                    <Grid container spacing={2}>
                        {receivedShares.map((share) => (
                            <Grid item xs={12} sm={6} md={4} key={share.id}>
                                <Card>
                                    <CardContent>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={selectedReceivedNotes.includes(share.sentNote.id)}
                                                    onChange={() => handleCheckboxChange(share.sentNote.id)}
                                                />
                                            }
                                            label={share.sentNote.title}
                                        />
                                        <Typography>Received from: {share.sender.firstName} {share.sender.lastName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Sent at: {share.sentAt}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {share.sentNote.text.slice(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => handleOpenDialog(share.sentNote.id, "view")}>
                                            View
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {activeTab === 1 && (
                    <Grid container spacing={2}>
                        {sentShares.map((share) => (
                            <Grid item xs={12} sm={6} md={4} key={share.id}>
                                <Card>
                                    <CardContent>
                                        <Typography>Sent to: {share.receiver.firstName} {share.receiver.lastName}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Sent at: {share.sentAt}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {share.sentNote.text.slice(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => handleOpenDialog(share.sentNote.id, "view")}>
                                            View
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {activeTab === 0 && receivedShares.length === 0 && (
                    <Typography sx={{ mt: 3 }}>No received notes found.</Typography>
                )}

                {activeTab === 1 && sentShares.length === 0 && (
                    <Typography sx={{ mt: 3 }}>No sent notes found.</Typography>
                )}

                {selectedReceivedNotes.length > 0 && (
                    <Box
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#fff',
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 2,
                            zIndex: 1300,
                        }}
                    >
                        <Typography variant="body2" sx={{ mr: 2, display: 'inline-block' }}>
                            {selectedReceivedNotes.length} note{selectedReceivedNotes.length > 1 ? 's' : ''} selected
                        </Typography>
                        <Button variant="contained" onClick={() => setOpenDownloadDialog(true)}>
                            Download Selected
                        </Button>
                        <DownloadDialog
                            open={openDownloadDialog}
                            onClose={() => setOpenDownloadDialog(false)}
                            selectedNotesIds={selectedReceivedNotes}
                        />
                        <Button variant="text" onClick={() => setSelectedReceivedNotes([])} sx={{ ml: 2 }}>
                            Clear Selection
                        </Button>
                    </Box>
                )}

                {selectedNoteId !== null && (
                    <SharedNoteDialog
                        open={open}
                        onClose={handleCloseDialog}
                        noteId={selectedNoteId}
                        dialogType={activeDialog}
                    />
                )}
            </Box>
        </Box>
    );
}

export default SharesPage;