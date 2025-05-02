import React from 'react';
import {Link} from 'react-router-dom';
import '../resources/sidebar.css';
import {useUser} from "./userContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Typography, Box, Button} from '@mui/material';

const Sidebar = ({onLogout}) => {
    const {logout} = useUser();

    const handleLogout = () => {
        logout();
    };

    return (

        <Drawer
            variant="permanent"
            anchor="left"
            className="sidebar-drawer"
            PaperProps={{
                sx: {
                    backgroundColor: "#4a749f",
                    color: "#ffffff",
                },
                className: "sidebar-paper",
            }}
        >
            <Box className="sidebar-box">
                <Typography variant="h5" className="sidebar-title">
                    Navigation
                </Typography>

                <List className="sidebar-list">
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/home" id="homePageElement" className="sidebar-link">
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/create-note" id="createNoteElement"
                                        className="sidebar-link">
                            <ListItemText primary="Create new note"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/view-notes" id="viewNotesElement"
                                        className="sidebar-link">
                            <ListItemText primary="View notes"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/shares" id="sharedNotesElement" className="sidebar-link">
                            <ListItemText primary="Shares"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/friends" id="friendList" className="sidebar-link">
                            <ListItemText primary="Friends"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/user-requests" id="userRequests" className="sidebar-link">
                            <ListItemText primary="Manage requests"/>
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/profile" id="profileElement" className="sidebar-link">
                            <ListItemText primary="Profile"/>
                        </ListItemButton>
                    </ListItem>
                </List>

                <Divider className="sidebar-divider"/>

                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} id="logoutButton" className="sidebar-logout">
                            <FontAwesomeIcon icon={faDoorOpen} sx={{mr: 1}}/>
                            <ListItemText primary="Logout"/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>

    );
};

export default Sidebar;