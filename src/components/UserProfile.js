import {useUser} from "./userContext";
import Sidebar from "./Sidebar";
import React from "react";
import {useState} from 'react';
import {deleteAccount, updateUserCredentials} from "./api";
import ConfirmDeletePopup from "./DeletePopup";
import '../resources/delete-popup.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faUserSlash} from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
    const [error, setError] = useState('');
    const {logout, update} = useUser();

    const user = JSON.parse(sessionStorage.getItem('userInfo')) || {};
    const userId = user.id || null;

    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleDeleteAccount = async () => {
        setIsPopupOpen(false);
        try {
            await deleteAccount(userId);
            alert('Account deleted successfully');
            logout();
        } catch (error) {
            setError('Error deleting account');
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
            <div className="main-content">
                <form onSubmit={handleSubmit} className="form">
                    {error && <div className="error" aria-live="assertive" id="errorMessage">{error}</div>}
                    <h2>User profile</h2>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email || ''}
                            readOnly
                            placeholder="Email"
                            required
                        />
                    </div>
                    <button type="submit" id="updateButton" onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faSave}/>Update
                    </button>

                    <button type="button" id="deletePopupButton" onClick={openPopup} className="delete-acc-btn">
                        <FontAwesomeIcon icon={faUserSlash} />Delete account
                    </button>

                    <ConfirmDeletePopup
                        isOpen={isPopupOpen}
                        onClose={closePopup}
                        onConfirm={handleDeleteAccount}
                    />
                </form>
            </div>
        </div>
    );
};

export default UserProfile;