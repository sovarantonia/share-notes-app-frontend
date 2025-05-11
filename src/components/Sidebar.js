import React from 'react';
import {Link} from 'react-router-dom';
import {useUser} from "./userContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Typography, Box} from '@mui/material';

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
                    width: 250,
                    backgroundColor: "#4a749f",
                    color: "#ffffff",
                    borderRight: 0,
                },
            }}
        >
            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                <Typography variant="h5" className="sidebar-title" sx={{
                    fontWeight: 570,
                    textAlign: 'center',
                    mb: 2,
                    color: 'inherit',
                }}>
                    Navigation
                </Typography>

                <List sx={{ flexGrow: 1 }}>
                    {[
                        { text: "Home", to: "/home", id: "homePageElement" },
                        { text: "Create new note", to: "/create-note", id: "createNoteElement" },
                        { text: "View notes", to: "/view-notes", id: "viewNotesElement" },
                        { text: "Shares", to: "/shares", id: "sharedNotesElement" },
                        { text: "Friends", to: "/friends", id: "friendList" },
                        { text: "Manage requests", to: "/user-requests", id: "userRequests" },
                        { text: "Profile", to: "/profile", id: "profileElement" },
                    ].map((item) => (
                        <ListItem key={item.id} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.to}
                                id={item.id}
                                sx={{
                                    color: 'inherit',
                                    '&:hover': {
                                        backgroundColor: '#3a6283',
                                    },
                                }}
                            >
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ backgroundColor: '#ffffff33', my: 2 }} />

                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            id="logoutButton"
                            sx={{
                                color: 'inherit',
                                '&:hover': {
                                    backgroundColor: '#3a6283',
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={faDoorOpen} style={{ marginRight: '8px' }} />
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;