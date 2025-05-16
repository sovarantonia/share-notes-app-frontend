import React, {useEffect, useState} from "react";
import {acceptRequest, declineRequest, getReceivedRequests, getSentRequests} from "./api";
import {useUser} from "./userContext";
import Sidebar from "./Sidebar";
import {
    Alert,
    Button,
    Snackbar,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs
} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {debounce} from "lodash";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const RequestsPage = () => {
    const {logout} = useUser();
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(0);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'

    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const fetchRequests = async () => {
        try {
            const data = await getReceivedRequests();
            setRequests(data);
        } catch (error) {
            setError('Error fetching requests:');
        }
    }

    const fetchSentRequests = async () => {
        try {
            const data = await getSentRequests();
            setSentRequests(data);
        } catch (error) {
            setError('Error fetching requests:');
        }
    }

    useEffect(() => {
        fetchRequests();
        fetchSentRequests();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await acceptRequest(requestId);
            showSnackbar('Request accepted!', 'success');
            debouncedFetchRequests();
        } catch (error) {
            setError('Error accepting the request');
            showSnackbar('Error accepting the request', 'error');
        }
    }

    const handleDeclineRequest = async (requestId) => {
        try {
            await declineRequest(requestId);
            showSnackbar('Request declined.', 'success');
            debouncedFetchRequests();
        } catch (error) {
            setError('Error declining the request')
            showSnackbar('Error declining the request', 'error');
        }
    }

    const debouncedFetchRequests = debounce(() => {
        fetchRequests();
    }, 300);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f4f9' }}>
            {/* Sidebar */}
            <Box sx={{ width: 250, flexShrink: 0 }}>
                <Sidebar onLogout={handleLogout} />
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Tabs value={showTable} onChange={(e, newValue) => setShowTable(newValue)} sx={{ mb: 3 }}>
                    <Tab label="Received Requests" />
                    <Tab label="Sent Requests" />
                </Tabs>

                {/* Received Requests Table */}
                {showTable === 0 && requests.length > 0 && (
                    <TableContainer id="receivedRequests" sx={{ maxWidth: 1000 }}>
                        <Table aria-label="received-requests">
                            <TableHead>
                                <TableRow>
                                    {['Sender', 'Status', 'Sent At', 'Options'].map(header => (
                                        <TableCell key={header}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{`${item.sender.firstName} ${item.sender.lastName} (${item.sender.email})`}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>{item.sentAt}</TableCell>
                                        <TableCell>
                                            <Button
                                                id="acceptButton"
                                                size="small"
                                                onClick={() => handleAcceptRequest(item.id)}
                                                sx={{
                                                    backgroundColor: '#2db34b',
                                                    color: '#fff',
                                                    mr: 1,
                                                    '&:hover': { backgroundColor: '#218838' },
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faCheck} style={{ marginRight: 4 }} />
                                                Accept
                                            </Button>
                                            <Button
                                                id="declineButton"
                                                size="small"
                                                onClick={() => handleDeclineRequest(item.id)}
                                                sx={{
                                                    backgroundColor: '#f44336',
                                                    color: '#fff',
                                                    '&:hover': { backgroundColor: '#bf342a' },
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} style={{ marginRight: 4 }} />
                                                Decline
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Sent Requests Table */}
                {showTable === 1 && sentRequests.length > 0 && (
                    <TableContainer id="sentRequests" sx={{ maxWidth: 1000 }}>
                        <Table aria-label="sent-requests">
                            <TableHead>
                                <TableRow>
                                    {['Receiver', 'Status', 'Sent At'].map(header => (
                                        <TableCell key={header}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sentRequests.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{`${item.receiver.firstName} ${item.receiver.lastName} (${item.receiver.email})`}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>{item.sentAt}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Empty states */}
                {showTable === 0 && requests.length === 0 && (
                    <Typography>No received requests.</Typography>
                )}
                {showTable === 1 && sentRequests.length === 0 && (
                    <Typography>No sent requests.</Typography>
                )}
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

export default RequestsPage;