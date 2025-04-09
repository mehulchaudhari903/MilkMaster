import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  Alert,
  Card,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import config from '../../config';
import bcrypt from 'bcryptjs';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStep, setResetStep] = useState('request'); // 'request', 'reset', 'success'

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (token && isLoggedIn) {
      // User is already logged in, redirect to home page
      navigate('/');
    }
  }, [navigate]);
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setStatus({
        type: 'error',
        message: 'Email is required',
      });
      return;
    }
    
    if (!validateEmail(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const response = await axios.post(`${config.apiUrl}/api/forgot-password`, { email });
      
      // For development purposes - in production this would come via email
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
        setResetStep('reset');
        setStatus({
          type: 'success',
          message: 'Email verified. Please set your new password below.',
        });
      } else {
        // If no token was returned, show a not-found message
        setStatus({
          type: 'error',
          message: 'No account found with this email address.',
        });
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to process your request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!newPassword) {
      setStatus({
        type: 'error',
        message: 'New password is required',
      });
      return;
    }
    
    if (newPassword.length < 6) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 6 characters long',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match',
      });
      return;
    }
    
    setLoading(true);
    setStatus({ type: '', message: '' });

    
    try {
      const response = await axios.post(`${config.apiUrl}/api/reset-password`, {
        token: resetToken,
        newPassword: newPassword,
      });
      
      setStatus({
        type: 'success',
        message: response.data.message,
      });
      
      setResetStep('success');
    } catch (error) {
      console.error('Error resetting password:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRequestForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
      <TextField
        fullWidth
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
       
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        className="bg-primary-600 hover:bg-primary-700"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
      </Button>
    </form>
  );

  const renderResetForm = () => (
    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        margin="normal"
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        className="bg-primary-600 hover:bg-primary-700"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
      </Button>
    </form>
  );

  const renderSuccessMessage = () => (
    <div className="mt-8 space-y-6 text-center">
      <Typography variant="h6" className="text-green-600">
        Your password has been reset successfully!
      </Typography>
      <Typography variant="body1">
        You can now login with your new password.
      </Typography>
      <Button
        component={Link}
        to="/login"
        fullWidth
        variant="contained"
        color="primary"
      >
        Go to Login
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Typography variant="h4" className="font-bold text-gray-900">
            {resetStep === 'request' 
              ? 'Forgot Password' 
              : resetStep === 'reset' 
                ? 'Reset Your Password' 
                : 'Password Reset Complete'}
          </Typography>
          {resetStep === 'request' && (
            <Typography variant="body2" className="mt-2 text-gray-600">
              Enter your email address and we'll send you instructions to reset your password
            </Typography>
          )}
          {resetStep === 'reset' && (
            <Typography variant="body2" className="mt-2 text-gray-600">
              Enter and confirm your new password
            </Typography>
          )}
        </div>

        {status.message && (
          <Alert severity={status.type} className="mt-4">
            {status.message}
          </Alert>
        )}

        {resetStep === 'request' && renderRequestForm()}
        {resetStep === 'reset' && renderResetForm()}
        {resetStep === 'success' && renderSuccessMessage()}

        {resetStep !== 'success' && (
          <div className="mt-4">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
            >
              <ArrowBackIcon className="w-4 h-4 mr-2" />
              Back to Sign in
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword; 