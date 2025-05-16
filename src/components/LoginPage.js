import React, {useEffect, useState} from 'react';
import {login} from './api';
import {useNavigate, Link} from "react-router-dom";
import {useUser} from './userContext';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert, Button, InputAdornment, Snackbar, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import login_avatar from '../resources/login-avatar.svg';
import PublicHeader from "./Header";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const [formValid, setFormValid] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const showSnackbar = (message, severity = 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const navigate = useNavigate();
    const { login: setUser } = useUser();

    const handleTogglePassword = () => setShowPassword((show) => !show);

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    useEffect(() => {
        setFormValid(email.trim() !== '' && password.trim() !== '');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formValid) {
            setTouched({ email: true, password: true });
            return;
        }

        try {
            const response = await login(email, password);
            const { userInfo, tokenValue } = response;
            const { email: userEmail, id, firstName, lastName } = userInfo;

            setUser({ email: userEmail, id, firstName, lastName }, tokenValue);
            navigate('/home');
        } catch (error) {
            showSnackbar('Login failed. Please check your credentials.', 'error');
        }
    };

    return (
        <Box>
            <PublicHeader />
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                autoComplete="off"
                sx={{
                    maxWidth: 400,
                    margin: '80px auto',
                    padding: 4,
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box component="img" src={login_avatar} alt="App Logo" sx={{ height: 85,mb: 1 }} />
                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                    Login
                </Typography>

                {error && (
                    <Typography color="error" aria-live="assertive" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {error}
                    </Typography>
                )}

                <TextField
                    id="emailInput"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={touched.email && !email}
                    helperText={touched.email && !email ? 'Email is required' : ''}
                    fullWidth
                    required
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    error={touched.password && !password}
                    helperText={touched.password && !password ? 'Password is required' : ''}
                    fullWidth
                    required
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePassword}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!formValid}
                    sx={{ mx: 'auto', mt: 1 }}
                >
                    Login
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none' }}>
                        Register
                    </Link>
                </Typography>
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

export default LoginPage;