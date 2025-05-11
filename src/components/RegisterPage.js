import React, {useEffect, useState} from 'react';
import {register} from "./api";
import {Link, useNavigate} from 'react-router-dom';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Button, InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import register_avatar from '../resources/register-avatar.svg';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RegisterPage = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [formValid, setFormValid] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        const newErrors = {};
        if (!form.firstName) newErrors.firstName = 'First name is required.';
        if (!form.lastName) newErrors.lastName = 'Last name is required.';
        if (!form.email) newErrors.email = 'Email is required.';
        else if (!validateEmail(form.email)) newErrors.email = 'Invalid email format.';
        if (!form.password) newErrors.password = 'Password is required.';
        else if (form.password.length < 7) newErrors.password = 'Minimum 7 characters.';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm your password.';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setErrors(newErrors);
        setFormValid(Object.keys(newErrors).length === 0);
    }, [form]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');
        if (!formValid) return;

        try {
            await register({firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password});
            alert('Registration successful! Please login with your credentials.');
            navigate('/login');
        } catch (error) {
            try {
                const parsedError = JSON.parse(error.message);
                setSubmitError(parsedError || 'Something went wrong.');
            } catch {
                setSubmitError('An unexpected error occurred.');
            }
        }
    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{
                maxWidth: 450,
                margin: '20px auto',
                padding: 4,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box component="img" src={register_avatar} alt="App Logo" sx={{ height: 85,mb: 1 }} />
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Register
            </Typography>

            {submitError && (
                <Typography color="error" id="errorMessage" aria-live="assertive" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {submitError}
                </Typography>
            )}

            <TextField
                label="First name"
                value={form.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                fullWidth
                required
            />

            <TextField
                label="Last name"
                value={form.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                fullWidth
                required
            />

            <TextField
                label="Email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                fullWidth
                required
            />

            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                fullWidth
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleTogglePassword} edge="end" aria-label="toggle password visibility">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword && !!errors.confirmPassword}
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleTogglePassword} edge="end" aria-label="toggle password visibility">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!formValid}
                sx={{ mx: 'auto'}}
            >
                Register
            </Button>

            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Login
                </Link>
            </Typography>
        </Box>
    );
};


export default RegisterPage;