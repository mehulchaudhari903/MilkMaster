import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Alert,
  Card,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import config from '../../config';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [resetComplete, setResetComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  useEffect(() => {
    // In a real application, you would validate the token on component mount
    if (!token) {
      setTokenValid(false);
      setStatus({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new password reset link.',
      });
    }
  }, [token]);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (token && isLoggedIn) {
      // User is already logged in, redirect to home page
      navigate('/');
    }
  }, [navigate]);

  // Validate password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }

    let score = 0;
    let feedback = '';

    // Length check
    if (newPassword.length >= 8) {
      score += 1;
    } else {
      feedback = 'Password should be at least 8 characters long';
    }

    // Complexity checks
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    // Provide feedback based on score
    if (score < 3 && !feedback) {
      feedback = 'Try adding uppercase letters, numbers, or special characters';
    }

    setPasswordStrength({ score, feedback });
  }, [newPassword]);

  const handleSubmit = async (e) => {
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
        token,
        newPassword,
      });
      
      setStatus({
        type: 'success',
        message: response.data.message,
      });
      
      setResetComplete(true);
      
      // After successful password reset, log the user in
      const loginResponse = await axios.post(`${config.apiUrl}/api/user/login`, {
        email: response.data.user.email,
        password: newPassword
      });
      
      if (loginResponse.data.token) {
        // Store user data and token
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Update success message
        setStatus({
          type: 'success',
          message: 'Password reset successful! You will be redirected to the home page.',
        });
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
        return;
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to reset password. Please try again.',
      });
      
      // If token is invalid or expired, set tokenValid to false
      if (error.response?.data?.message?.includes('token')) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score <= 1) return 'error';
    if (score <= 3) return 'warning';
    return 'success';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {resetComplete ? (
            <CheckCircleOutlineIcon fontSize="large" color="success" className="mb-2" />
          ) : !tokenValid ? (
            <ErrorOutlineIcon fontSize="large" color="error" className="mb-2" />
          ) : (
            <LockResetIcon fontSize="large" color="primary" className="mb-2" />
          )}
          <Typography variant="h4" className="font-bold text-gray-900">
            {resetComplete ? 'Password Reset Complete' : 'Reset Your Password'}
          </Typography>
          {!resetComplete && tokenValid && (
            <Typography variant="body2" className="mt-2 text-gray-600">
              Please create a strong password for your account
            </Typography>
          )}
        </div>

        {status.message && (
          <Alert severity={status.type} className="mt-4">
            {status.message}
          </Alert>
        )}

        {tokenValid && !resetComplete ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {newPassword && (
              <Box className="space-y-2">
                <Typography variant="caption" color={getPasswordStrengthColor()}>
                  Password strength: {['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][Math.min(passwordStrength.score, 4)]}
                </Typography>
                {passwordStrength.feedback && (
                  <Typography variant="caption" color="error" display="block">
                    {passwordStrength.feedback}
                  </Typography>
                )}
                <Box className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <Box 
                    className={`h-full ${
                      passwordStrength.score <= 1 
                        ? 'bg-red-500' 
                        : passwordStrength.score <= 3 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(passwordStrength.score * 25, 100)}%` }}
                  />
                </Box>
              </Box>
            )}
            
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
              error={confirmPassword && newPassword !== confirmPassword}
              helperText={
                confirmPassword && newPassword !== confirmPassword
                  ? "Passwords don't match"
                  : ""
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              className="bg-primary-600 hover:bg-primary-700"
              disabled={loading || passwordStrength.score < 2 || newPassword !== confirmPassword}
              startIcon={<LockResetIcon />}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </form>
        ) : resetComplete ? (
          <div className="mt-8 space-y-6 text-center">
            <Typography variant="h6" className="text-green-600">
              Your password has been reset successfully!
            </Typography>
            <Typography variant="body1">
              You will be redirected to the login page shortly.
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
        ) : (
          <div className="mt-8 space-y-6 text-center">
            <Typography variant="body1" className="text-gray-600">
              The password reset link is invalid or has expired.
            </Typography>
            <Button
              component={Link}
              to="/forgot-password"
              fullWidth
              variant="contained"
              color="primary"
            >
              Request New Reset Link
            </Button>
          </div>
        )}

        <div className="mt-4">
          <Link
            to="/login"
            className="flex items-center justify-center text-sm text-primary-600 hover:text-primary-500"
          >
            Back to Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword; 