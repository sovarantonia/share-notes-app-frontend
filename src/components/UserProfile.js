import {useUser} from "./userContext";
import Sidebar from "./Sidebar";
import React from "react";
import {useState} from 'react';
import {deleteAccount, updateUserCredentials} from "./api";
import ConfirmDeleteDialog from "./DeleteUserDialog";
import '../resources/user-profile.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faUserSlash} from "@fortawesome/free-solid-svg-icons";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {Button, TextField} from "@mui/material";

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
            alert('Account deleted successfully');
            logout();
        } catch (error) {
            setError('Error deleting account');
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

            alert('Profile updated successfully');
        } catch (error) {
            setError('Error updating profile');
        }
    };

    return (
        <div className="user-profile">
            <Sidebar onLogout={handleLogout}/>
            <Typography variant="h4" gutterBottom>
                User profile
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" id="userProfile"
                 className="user-profile">
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive">
                        {error}
                    </Typography>
                )}
                <TextField id="firstNameInput" label="First Name" value={firstName}
                           onChange={(e) => setFirstName(e.target.value)}/>
                <TextField id="lastNameInput" label="Last Name" value={lastName}
                           onChange={(e) => setLastName(e.target.value)}/>
                <TextField id="emailInput" label="Email" value={user.email} InputProps={{readOnly: true}}
                           variant="filled"/>
                <Button type="submit" variant="contained" color="primary"
                        startIcon={<FontAwesomeIcon icon={faSave}/>}>Update</Button>
                <Button onClick={()=> setOpenDialog(true)} variant="contained" color="secondary"
                        startIcon={<FontAwesomeIcon icon={faUserSlash}/>}>Delete account</Button>
            </Box>
            <ConfirmDeleteDialog isOpen={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleDeleteAccount}/>
        </div>
    );
};

export default UserProfile;