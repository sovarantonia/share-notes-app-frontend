import {useUser} from "./userContext";
import Sidebar from "./Sidebar";
import React from "react";
import {useState} from 'react';
import {deleteAccount, updateUserCredentials} from "./api";
import ConfirmDeleteDialog from "./DeleteUserDialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faUserSlash} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Alert, Button, Snackbar, TextField} from "@mui/material";

const UserProfile = () => {
    const [error, setError] = useState('');
    const {logout, update} = useUser();

    const user = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    const userId = user.id || null;

    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');

    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(userId);
            showSnackbar('Account deleted successfully', 'success');
            logout();
        } catch (error) {
            showSnackbar('Error deleting account', 'error');
        }
        finally {
            setOpenDialog(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!firstName || !lastName) {
            setError('Fields should not be empty');
            return;
        }
        try {
            const response = await updateUserCredentials(userId, firstName, lastName);

            const updatedUser = {...user, firstName: response.firstName, lastName: response.lastName};
            sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));

            update(updatedUser)

            showSnackbar('Profile updated successfully', 'success');
        } catch (error) {
            showSnackbar('Error updating the profile', 'error');
        }
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default'}}>
            <Box sx={{ width: 250, flexShrink: 0 }}>
                <Sidebar onLogout={handleLogout} />
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4,  }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    autoComplete="off"
                    id="userProfile"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxWidth: 500,
                        width: '100%',
                        backgroundColor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        User Profile
                    </Typography>

                    {error && (
                        <Typography color="error" id="errorMessage" aria-live="assertive">
                            {error}
                        </Typography>
                    )}

                    <TextField
                        id="firstNameInput"
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        id="lastNameInput"
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        id="emailInput"
                        label="Email"
                        value={user.email}
                        InputProps={{ readOnly: true }}
                        variant="filled"
                        fullWidth
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 15, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={<FontAwesomeIcon icon={faSave} />}
                        >
                            Update
                        </Button>
                        <Button
                            onClick={() => setOpenDialog(true)}
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<FontAwesomeIcon size="xs" icon={faUserSlash} />}
                        >
                            Delete Account
                        </Button>
                    </Box>
                </Box>

                <ConfirmDeleteDialog
                    isOpen={openDialog}
                    onClose={() => setOpenDialog(false)}
                    onConfirm={handleDeleteAccount}
                />
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
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
};

export default UserProfile;