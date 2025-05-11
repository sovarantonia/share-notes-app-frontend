import {Link} from "react-router-dom";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import PublicHeader from "./Header";
const AboutPage = () => {
    return (
        <>
            <PublicHeader />
            <Box
                sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(to right, #f0f4f8, #dfeaf5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    py: 6,
                    px: 2,
                    pt: { xs: 10, sm: 12 }, // Push down content below header
                }}
            >
                <Box
                    sx={{
                        maxWidth: 800,
                        backgroundColor: '#ffffffdd',
                        borderRadius: 3,
                        boxShadow: 3,
                        p: 4,
                        textAlign: 'center',
                        mt: 2,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Empower Your Personal Growth
                    </Typography>
                    <Typography paragraph>
                        Whether you're setting goals or reflecting on achievements, our app provides a platform for creating notes that inspire and push you toward personal growth
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Keep Your Motivation on Track
                    </Typography>
                    <Typography paragraph>
                        Our app helps you stay committed by offering a variety of tools to track your milestones and visualize your progress
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Your Notes, Your Motivation—Accessible Anytime
                    </Typography>
                    <Typography paragraph>
                        No matter where you are, your notes are always within reach
                    </Typography>

                    <Typography variant="h4" gutterBottom>
                        Build the Best Version of Yourself
                    </Typography>
                    <Typography paragraph>
                        Join a growing community of individuals focused on unlocking their potential
                    </Typography>

                    <Button
                        component={Link}
                        to="/login"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 3 }}
                    >
                        Start documenting your journey today
                    </Button>
                </Box>
            </Box>
        </>
    );
};


export default AboutPage;