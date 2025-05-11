import React from 'react';
import {Link} from 'react-router-dom';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import PublicHeader from "./Header";

const LandingPage = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 3,
                textAlign: 'center',
            }}
        >
            <PublicHeader />
            <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
                Empower Your Personal Growth
            </Typography>

            <Typography variant="h6" sx={{ mb: 4, maxWidth: 700 }}>
                Create notes that inspire your journey. Document your progress, stay motivated, and access your personal insights anytime, anywhere.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 6 }}>
                <Button component={Link} to="/about" variant="outlined" color="secondary" sx={{ px: 3, py: 1.5 }}>
                    Learn More
                </Button>
                <Button component={Link} to="/login" variant="contained" color="primary" sx={{ px: 3, py: 1.5 }}>
                    Start Your Journey
                </Button>
            </Box>

            <Box sx={{ maxWidth: 900, px: 2 }}>
                <Typography variant="h5" sx={{ mt: 4, mb: 1, fontWeight: 500 }}>
                    Keep Your Motivation on Track
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Visualize your progress and stay focused on your goals with our interactive tracking tools.
                </Typography>

                <Typography variant="h5" sx={{ mt: 4, mb: 1, fontWeight: 500 }}>
                    Your Notes, Anytime, Anywhere
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Access your notes across devices. Your ideas and reflections are always with you.
                </Typography>

                <Typography variant="h5" sx={{ mt: 4, mb: 1, fontWeight: 500 }}>
                    Join a Motivated Community
                </Typography>
                <Typography variant="body1">
                    Connect with others who are also on a journey to grow and achieve more. Share insights, inspire, and be inspired.
                </Typography>
            </Box>
        </Box>
    );
};

export default LandingPage;