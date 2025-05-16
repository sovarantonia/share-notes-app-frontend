import React, {useEffect, useState} from "react";
import {getUserFriends, getUsersNotFiendsWith, removeFriend, sendRequest} from "./api";
import {debounce} from "lodash";
import Sidebar from "./Sidebar";
import {useUser} from "./userContext";
import {
    Alert,
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import DropdownInput from "./DropdownInput";
import Box from "@mui/material/Box";

const FriendsPage = () => {
    const {logout} = useUser();
    const [error, setError] = useState('')
    const [friends, setFriends] = useState([])
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [openDialog, setOpenDialog] = useState(false);
    const [friendIdToRemove, setFriendIdToRemove] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleLogout = () => {
        logout();
    };
    const sendFriendRequest = async (senderId, receiverEmail) => {
        try {
            await sendRequest(senderId, receiverEmail);
            showSnackbar("Request was sent", 'success')
        } catch (error) {
            showSnackbar("Error sending the request", 'error');

        }
    }

    const handleSendRequest = () => {
        if (selectedUser) {
            const user = JSON.parse(sessionStorage.getItem('userInfo')) || {};
            const senderId = user.id || null;
            const receiverEmail = selectedUser.email;
            sendFriendRequest(senderId, receiverEmail)
        } else {
            showSnackbar("Please select a user.", 'error');
        }
    }

    const fetchFriends = async () => {
        try {
            const data = await getUserFriends();
            setFriends(data);
        } catch (error) {
            setError('Error retrieving the friend list')
        }
    }

    const removeFromFriendList = async (friendId) => {
        try {
            await removeFriend(friendId);
            showSnackbar('User was removed from friend list', 'success')
            debounceFriendList();
        } catch (error) {
            showSnackbar('Error removing use from friend list', 'error')
        }
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    const debounceFriendList = debounce(() => {
        fetchFriends()
    }, 300);

    const getUsers = async (searchString) => {
        const data = await getUsersNotFiendsWith(searchString);
        setUserList(data);
    }

    const debounceGetUsers = debounce((searchString) => {
        getUsers(searchString);
    }, 300);

    const handleRemoveClick = (friendId) => {
        setFriendIdToRemove(friendId);
        setOpenDialog(true); // Open confirmation dialog
    };

    const confirmRemoveFriend = async () => {
        removeFromFriendList(friendIdToRemove)
        setOpenDialog(false); // Close dialog after action
        setFriendIdToRemove(null); // Reset friend ID
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Close dialog without action
        setFriendIdToRemove(null); // Reset friend ID
    };


    return (
        <Box sx={{display: 'flex', minHeight: '100vh', backgroundColor: '#f1f4f9'}}>
            <Box sx={{width: 250, flexShrink: 0}}>
                <Sidebar onLogout={handleLogout}/>
            </Box>

            <Box sx={{flexGrow: 1, padding: '24px'}}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive">
                        {error}
                    </Typography>
                )}

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 3}}>
                    <Typography sx={{flexShrink: 0}} variant="h5">Send request:</Typography>
                    <DropdownInput options={userList} onSearch={debounceGetUsers} onSelect={setSelectedUser}/>
                    <Button
                        onClick={handleSendRequest}
                        id="sendRequestButton"
                        variant="contained"
                        sx={{
                            backgroundColor: '#2db34b',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': {backgroundColor: '#218838'}
                        }}
                    >
                        Send
                    </Button>
                </Box>

                <TableContainer id="friendList">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First name</TableCell>
                                <TableCell>Last name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Option</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {friends.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.firstName}</TableCell>
                                    <TableCell>{item.lastName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>
                                        <Button
                                            id="removeButton"
                                            size="small"
                                            onClick={() => handleRemoveClick(item.id)}
                                            startIcon={<FontAwesomeIcon icon={faTimes}/>}
                                            sx={{color: '#9a1308'}}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Removal</DialogTitle>
                    <DialogContent>
                        <DialogContentText>This action cannot be undone</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: '16px'}}>
                            <Button onClick={confirmRemoveFriend} color="primary" variant="contained" sx={{
                                backgroundColor: '#9a1308',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#771810'
                                }
                            }}>
                                Remove
                            </Button>
                            <Button onClick={handleCloseDialog} color="secondary" variant="outlined" sx={{
                                borderColor: '#2db34b',
                                color: '#2db34b',
                                '&:hover': {
                                    backgroundColor: '#218838',
                                    borderColor: '#218838',
                                    color: '#fff'
                                }
                            }}>
                                Cancel
                            </Button>
                        </Box>
                    </DialogActions>
                </Dialog>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        backgroundColor:
                            snackbarSeverity === 'success' ? 'rgba(45,179,75,0.27)' :
                                snackbarSeverity === 'error' ? 'rgba(211,47,47,0.29)' :
                                    undefined,
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
export default FriendsPage;