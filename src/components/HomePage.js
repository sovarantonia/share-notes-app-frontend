import React, {useEffect, useState} from "react";
import Sidebar from "./Sidebar";
import {useUser} from "./userContext";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {latestNotes} from "./api";
import NotesChart from "./NotesChart";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const HomePage = () => {
    const {logout} = useUser();

    const handleLogout = () => {
        logout();
    };

    const [notes, setNotes] = useState([])
    const [error, setError] = useState('')

    const getLatestNotes = async () => {
        try {
            const response = await latestNotes();
            setNotes(response)
        } catch (error) {
            setError('Error retrieving the notes')
        }
    }

    useEffect(() => {
        getLatestNotes();
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f4f9' }}>

            <Box sx={{ width: 250, flexShrink: 0 }}>
                <Sidebar onLogout={handleLogout} />
            </Box>

            <Box sx={{ flexGrow: 1, p: 3 }}>
                <NotesChart />

                {error && (
                    <Typography color="error" id="errorMessage" aria-live="assertive" sx={{ my: 2 }}>
                        {error}
                    </Typography>
                )}

                <Typography variant="h4" gutterBottom>
                    Latest notes
                </Typography>

                <TableContainer
                    id="recentNotesTable"
                    sx={{
                        mt: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    <Table aria-label="latest-notes">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Grade</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {notes.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        sx={{
                                            textAlign: 'center',
                                            py: 4,
                                            fontStyle: 'italic',
                                            color: 'text.secondary',
                                            border: 'none',
                                        }}
                                    >
                                        No notes to display. Start creating notes now!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                notes.map((item) => (
                                    <TableRow key={item.id} hover>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{item.text}</TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.grade}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default HomePage;