import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Card,
  Typography,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import config from '../../config';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (token && isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear errors when user types
    if (name === 'email') {
      setEmailError('');
    } else if (name === 'password') {
      setPasswordError('');
    }
    setError('');
  };

  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!formData.email) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      }
    }

    // Password validation
    if (!formData.password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          if (data.message.includes('email')) {
            setEmailError('Email not found');
          } else if (data.message.includes('password')) {
            setPasswordError('Invalid password');
          } else {
            setError('Invalid credentials');
          }
        } else {
          throw new Error(data.message || 'Login failed');
        }
        return;
      }

      // Store user data and token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Navigate to home page on successful login
      navigate('/');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Typography variant="h4" className="font-bold text-gray-900">
            Welcome Back
          </Typography>
          <Typography variant="body2" className="mt-2 text-gray-600">
            Please sign in to your account
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
              required
              disabled={loading}
             
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              required
              disabled={loading}
              InputProps={{
              
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            className="bg-primary-600 hover:bg-primary-700"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign in'
            )}
          </Button>

          <Divider>
            <Typography variant="body2" className="text-gray-500">
              OR
            </Typography>
          </Divider>
          
          <div className="text-center mt-4">
            <Typography variant="body2" className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up
              </Link>
            </Typography>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login; 