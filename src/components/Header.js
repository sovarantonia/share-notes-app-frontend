import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import {Link} from "react-router-dom";

const PublicHeader = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box className="headerContainer" sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 1100 }}>
            <AppBar position="static" sx={{ background: '#4a749f' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Left - Menu Icon */}
                    <IconButton edge="start" color="inherit" onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>

                    {/* Center - Title */}
                    <Typography variant="h6" component={Link} to="/" sx={{
                        flexGrow: 1,
                        textAlign: 'center',
                        fontFamily: 'Papyrus',
                        fontSize: '24px',
                        color: '#fff',
                        textDecoration: 'none'
                    }}>
                        Share-Notes-App
                    </Typography>

                    {/* Hidden IconButton to keep center title centered */}
                    <Box sx={{ width: 48 }} />
                </Toolbar>
            </AppBar>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                <MenuItem component={Link} to="/" onClick={handleClose}>Home</MenuItem>
                <MenuItem component={Link} to="/about" onClick={handleClose}>About</MenuItem>
                <MenuItem component={Link} to="/login" onClick={handleClose}>Login</MenuItem>
                <MenuItem component={Link} to="/register" onClick={handleClose}>Register</MenuItem>
            </Menu>
        </Box>
    );
};

export default PublicHeader;