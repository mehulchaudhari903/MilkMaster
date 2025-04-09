import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Avatar,
  Card
} from '@mui/material';
import { useCart } from '../context/CartContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [fetchStatus, setFetchStatus] = useState({ success: false, message: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: '',
    paymentDetails: {
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: ''
    }
  });
  const [showStockRefresh, setShowStockRefresh] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [cardVerificationStatus, setCardVerificationStatus] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Get user ID from token
  const getUserInfoFromToken = (token) => {
    try {
      if (!token) return null;
      
      // Decode JWT token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      console.log('Decoded token:', decodedToken);
      
      // The backend JWT contains id, email, and role
      return {
        userId: decodedToken.id || null,
        email: decodedToken.email || null,
        role: decodedToken.role || null,
        tokenInfo: decodedToken
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return { userId: null, email: null, role: null, tokenInfo: null };
    }
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { 
          from: '/checkout',
          message: 'Please login to proceed with checkout' 
        }
      });
      return;
    }

    // Normalize cart items to ensure they have proper ID fields
    if (cartItems && cartItems.length > 0) {
      console.log('Normalizing cart items to ensure proper ID fields');
      cartItems.forEach(item => {
        // Ensure each item has at least one ID field
        if (!item._id && !item.id && !item.productId) {
          console.warn('Item missing ID:', item);
        } else {
          // Cross-populate ID fields if one exists
          if (item._id && !item.productId) item.productId = item._id;
          if (item.id && !item._id) item._id = item.id;
          if (item.productId && !item._id) item._id = item.productId;
        }
      });
    }

    // Try to get user info from multiple sources
    let storedUserInfo;
    try {
      storedUserInfo = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User info from localStorage:', storedUserInfo);
      setUserInfo(storedUserInfo);
    } catch (error) {
      console.error('Error parsing user info from localStorage:', error);
      storedUserInfo = {};
    }

    // Get user ID either from user object or token
    const { userId: tokenUserId, email: tokenEmail } = getUserInfoFromToken(token);
    console.log('User ID from token:', tokenUserId);
    console.log('Email from token:', tokenEmail);
    
    const userIdFromStorage = storedUserInfo.id || storedUserInfo._id;
    const effectiveUserId = userIdFromStorage || tokenUserId;
    
    if (effectiveUserId) {
      setUserId(effectiveUserId);
      console.log('Using user ID:', effectiveUserId);
    } else {
      console.error('No user ID found');
      setFetchStatus({
        success: false,
        message: 'No user ID found. Unable to load profile data.'
      });
      navigate('/login');
      return;
    }

    // Fetch user profile data from API
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        console.log(`Fetching user profile from: http://localhost:5000/api/user/profile`);
        const response = await fetch(`http://localhost:5000/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch profile');
        }

        const data = await response.json();
        console.log('User profile data from API:', data);
        
        // Set form data with user information from API
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || storedUserInfo.firstName || '',
          lastName: data.lastName || storedUserInfo.lastName || '',
          email: data.email || tokenEmail || storedUserInfo.email || '',
          phone: data.phone || storedUserInfo.phone || '',
          address: data.address || storedUserInfo.address || '',
          city: data.city || storedUserInfo.city || '',
          state: data.state || storedUserInfo.state || '',
          pincode: data.pincode || storedUserInfo.pincode || ''
        }));
        
        // Update user info with full data from API
        setUserInfo({
          ...storedUserInfo,
          ...data
        });
        
        setFetchStatus({
          success: true,
          message: 'Successfully loaded user data from backend'
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        
        // If API fails, use data from localStorage
        setFormData(prev => ({
          ...prev,
          firstName: storedUserInfo.firstName || '',
          lastName: storedUserInfo.lastName || '',
          email: storedUserInfo.email || tokenEmail || '',
          phone: storedUserInfo.phone || '',
          address: storedUserInfo.address || '',
          city: storedUserInfo.city || '',
          state: storedUserInfo.state || '',
          pincode: storedUserInfo.pincode || ''
        }));
        
        setFetchStatus({
          success: false,
          message: `Could not load data from backend: ${err.message}. Using locally stored data instead.`
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested payment details
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    }
  };

  const handleNext = () => {
    // Validate required fields before proceeding
    if (activeStep === 0) {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
      const emptyFields = requiredFields.filter(field => !formData[field].trim());
      
      if (emptyFields.length > 0) {
        setError(`Please fill all required fields: ${emptyFields.join(', ')}`);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }
    
    // If cart is empty, don't proceed to payment
    if (activeStep === 0 && cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }
    
    // Check if payment method is selected when moving to the final step
    if (activeStep === 2 && !formData.paymentMethod) {
      setError('Please select a payment method to continue');
      return;
    }
    
    setError(''); // Clear any previous errors
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Add a function to handle stock validation with retry capability
  const validateStock = async (items) => {
    try {
      setValidationError('');
      const token = localStorage.getItem('token');
      
      console.log('Validating stock for items:', items.map(item => ({
        id: item._id || item.id || item.productId,
        name: item.name,
        quantity: item.quantity,
        stock: item.stock
      })));
      
      const response = await fetch('http://localhost:5000/api/products/validate-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item._id || item.id || item.productId,
            quantity: item.quantity
          }))
        })
      });

      // Handle connection issues
      if (!response) {
        throw new Error('Network connection error. Please check your internet connection.');
      }

      // Get response text first to check if it's valid JSON
      const responseText = await response.text();
      
      // Try to parse the response as JSON
      let stockValidationData;
      try {
        stockValidationData = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.error('Error parsing stock validation response:', error);
        console.log('Raw response:', responseText);
        
        // If the server is returning HTML instead of JSON, it might be a server error
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html>')) {
          throw new Error('Server is down or returned an HTML error page. Please try again later.');
        }
        
        throw new Error('Server returned an invalid response format. Please try again.');
      }

      // If we have a valid response but not OK status
      if (!response.ok) {
        // Check if the response contains information about which items failed validation
        if (stockValidationData && stockValidationData.invalidItems && stockValidationData.invalidItems.length > 0) {
          const itemErrors = stockValidationData.invalidItems.map(item => 
            `${item.name || 'Product'}: Requested ${item.requested}, only ${item.available} in stock`
          );
          throw new Error(`Stock validation failed: ${itemErrors.join('; ')}`);
        }
        
        throw new Error(stockValidationData && stockValidationData.message 
          ? stockValidationData.message 
          : `Server error: ${response.status} ${response.statusText}`);
      }

      // If there's no data but response was OK, use fallback
      if (!stockValidationData) {
        console.warn('Server returned empty response with OK status');
        // Return success with default data
        return { 
          success: true, 
          data: { 
            message: 'All items in stock (fallback validation)',
            valid: true 
          } 
        };
      }

      return { success: true, data: stockValidationData };
    } catch (error) {
      console.error('Stock validation error:', error);
      return { success: false, error: error.message };
    }
  };

  // Add a retry handler
  const handleRetryValidation = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setError('');

    try {
      const result = await validateStock(cartItems);
      
      if (result.success) {
        // If validation succeeds, continue with order submission
        setValidationError('');
        handleContinueAfterValidation();
      } else {
        // If validation fails again, show error
        setValidationError(result.error);
        setShowStockRefresh(true);
      }
    } catch (err) {
      setValidationError('Failed to validate stock: ' + (err.message || 'Unknown error'));
      setShowStockRefresh(true);
    } finally {
      setIsRetrying(false);
    }
  };

  // Function to continue after successful validation
  const handleContinueAfterValidation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to place an order');
        navigate('/login', { 
          state: { 
            from: '/checkout',
            message: 'Please login to proceed with checkout' 
          }
        });
        return;
      }

      // Get user ID from multiple sources for reliability
      const { userId: tokenUserId } = getUserInfoFromToken(token);
      
      // Try to get user info from localStorage
      let storedUserInfo;
      try {
        storedUserInfo = JSON.parse(localStorage.getItem('user') || '{}');
      } catch (error) {
        console.error('Error parsing user info:', error);
        storedUserInfo = {};
      }

      // Determine the most reliable user ID to use
      const effectiveUserId = userId || 
                             storedUserInfo.id || 
                             tokenUserId;
      
      if (!effectiveUserId) {
        setError('Could not determine your user ID. Please try logging in again.');
        navigate('/login');
        return;
      }

      // Validate that all items have a valid ID
      const itemsWithoutId = cartItems.filter(item => 
        !item._id && !item.id && !item.productId
      );
      
      if (itemsWithoutId.length > 0) {
        console.error('Some items are missing product IDs:', itemsWithoutId);
        setError('Some products in your cart are missing identification. Please try removing and adding them again.');
        return;
      }

      // Check if payment method is selected
      if (!formData.paymentMethod) {
        setError('Please select a payment method to continue');
        return;
      }

      let paymentInfo = {};
      
      // Prepare payment details based on the selected payment method
      switch(formData.paymentMethod) {
        case 'card':
          paymentInfo = {
            cardNumber: formData.paymentDetails.cardNumber?.replace(/\s/g, ''),
            lastFour: formData.paymentDetails.cardNumber?.slice(-4) || '****',
            expiryDate: formData.paymentDetails.cardExpiry,
            cardName: formData.paymentDetails.cardName
          };
          break;
        case 'cod':
        default:
          paymentInfo = {};
      }

      const orderData = {
        userId: effectiveUserId,
        items: cartItems.map(item => {
          // Find the best available ID
          const productId = item._id || item.id || item.productId || '';
          if (!productId) {
            console.warn('Missing product ID for item:', item);
          }
          
          return {
            productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            remainingStock: item.remainingStock
          };
        }),
        total: getCartTotal(),
        deliveryAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: paymentInfo
      };

      console.log('Submitting order:', orderData);

      setLoading(true);
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Failed to place order';
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || 'Failed to place order';
        }
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const responseData = await response.json();
      
      if (!responseData) {
        throw new Error('No response data received from server');
      }

      console.log('Order placed successfully:', responseData);
      
      // Extract stock updates from the response
      const stockUpdates = responseData.stockUpdates || [];
      console.log('Stock updates:', stockUpdates);
      
      // Clear cart
      clearCart();
      
      // Navigate to order success page with order details
      navigate('/order-success', { 
        state: { 
          orderId: responseData._id || responseData.id,
          orderNumber: responseData.orderNumber,
          status: responseData.status,
          paymentMethod: responseData.paymentMethod,
          stockUpdates: stockUpdates
        } 
      });
    } catch (err) {
      console.error('Order submission error:', err);
      setError(`${err.message || 'An unknown error occurred. Please try again.'}`);
      setShowStockRefresh(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowStockRefresh(false);
    setValidationError('');
    setRetryCount(0);

    // Check if cart is empty
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items to your cart before placing an order.');
      setLoading(false);
      return;
    }

    // Validate payment method selection
    if (!formData.paymentMethod) {
      setError('Please select a payment method before placing an order.');
      setLoading(false);
      return;
    }

    // Validate card details if card payment method is selected
    if (formData.paymentMethod === 'card') {
      // Check if all card fields are filled
      const { cardNumber, cardExpiry, cardCvv, cardName } = formData.paymentDetails;
      
      if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        setError('Please fill in all card details before placing an order.');
        setLoading(false);
        return;
      }
      
      // Check if card is verified
      if (!otpVerified) {
        setError('Please verify your card payment before placing the order.');
        setLoading(false);
        return;
      }
    }

    try {
      // First check local stock validation
      const stockIssues = [];
      
      cartItems.forEach(item => {
        if (item.quantity > item.stock) {
          stockIssues.push({
            name: item.name,
            requested: item.quantity,
            available: item.stock
          });
        }
      });
      
      if (stockIssues.length > 0) {
        const errorMessages = stockIssues.map(issue => 
          `${issue.name}: Requested ${issue.requested}, only ${issue.available} in stock`
        );
        throw new Error(`Insufficient stock for the following items: ${errorMessages.join('; ')}`);
      }
      
      // Validate stock with the server
      const validationResult = await validateStock(cartItems);
      
      if (!validationResult.success) {
        setValidationError(validationResult.error);
        throw new Error(validationResult.error);
      }

      // Check payment method and verification
      if (formData.paymentMethod === 'card') {
        if (!otpVerified) {
          setError('Please verify your card payment before placing the order');
          setLoading(false);
          return;
        }
      }

      // Prepare order data with payment status
      const orderSubmissionData = {
        userId: userId,
        items: cartItems.map(item => ({
          productId: item._id || item.id || item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        total: getCartTotal(),
        deliveryAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentMethod === 'card' ? {
          ...formData.paymentDetails,
          verified: otpVerified,
          lastFour: formData.paymentDetails.cardNumber.slice(-4)
        } : undefined,
        paymentStatus: formData.paymentMethod === 'card' ? 'Paid' : 'Pending'
      };

      // Submit order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderSubmissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const orderResponse = await response.json();
      
      // Clear cart
      clearCart();
      
      // Navigate to order success page with order details
      navigate('/order-success', { 
        state: { 
          orderId: orderResponse._id,
          orderNumber: orderResponse.orderNumber,
          status: orderResponse.status,
          paymentStatus: orderResponse.paymentStatus,
          paymentMethod: orderResponse.paymentMethod
        } 
      });

    } catch (err) {
      console.error('Order submission error:', err);
      setError(err.message || 'An unknown error occurred. Please try again.');
      
      // If there's a stock validation error, show refresh option
      if (err.message.includes('stock') || err.message.includes('validation')) {
        setShowStockRefresh(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh function
  const handleRefreshCart = () => {
    window.location.reload();
  };

  // Update the handleCardVerification function
  const handleCardVerification = async () => {
    setIsVerifying(true);
    setVerificationError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          cardNumber: formData.paymentDetails.cardNumber,
          cardExpiry: formData.paymentDetails.cardExpiry,
          cardCvv: formData.paymentDetails.cardCvv,
          cardName: formData.paymentDetails.cardName
        })
      });

      const data = await response.json();
      console.log('Card verification response:', data);
      
      if (data.success) {
        setCardVerificationStatus('success');
        setCardDetails(data.cardDetails);
        
        // Store the OTP from the server response but don't auto-fill the form
        if (data.otp) {
          const otpValue = data.otp.toString();
          setOtp(otpValue);
          console.log('OTP received from server:', otpValue);
          
          // Send OTP via email
          const emailSent = await submitOTPMessage(
            otpValue,
            formData.paymentDetails.cardName,
            `${formData.firstName} ${formData.lastName}`
          );
          
          if (emailSent) {
            setOtpSent(true);
            // Show success message without revealing the OTP
            setVerificationError(`Card verified successfully! Please check your email for OTP.`);
          } else {
            setVerificationError(`Card verified but failed to send OTP email. Please try again.`);
          }
        } else {
          setOtpSent(true);
          setVerificationError(`Card verified successfully! Please check your email for OTP.`);
        }
      } else {
        setCardVerificationStatus('error');
        setVerificationError(data.message || 'Card verification failed');
      }
    } catch (error) {
      console.error('Card verification error:', error);
      setCardVerificationStatus('error');
      setVerificationError('Error verifying card. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Function to send OTP message via email
  const submitOTPMessage = async (otp, cardName, holderName) => {
    if (otp && cardName && holderName) {
      const message = `Dear Customer, Your OTP for an online purchase of Rs. ${getCartTotal()} at MilkMaster (Holder: ${holderName}) is ${otp}. Please do not share this OTP with anyone.`;
      const object = {
        Subject: "BankCard OTP",
        message: message,
        access_key: "59514737-8b60-43af-b7c4-376df900c936",
      };

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(object),
        }).then((res) => res.json());

        console.log("API Response:", res);

        if (res.success) {
          console.log("Success", res);
          return true;
        } else {
          console.log("Failed", res);
          return false;
        }
      } catch (error) {
        console.error("Error:", error);
        return false;
      }
    }
    return false;
  };

  // Update the handleOtpVerification function
  const handleOtpVerification = async () => {
    setIsVerifying(true);
    setVerificationError('');
    
    const enteredOtp = formData.paymentDetails.otp;
    const expectedOtp = otp;
    
    console.log('OTP Verification attempt:');
    console.log('- Entered OTP:', enteredOtp);
    console.log('- Expected OTP:', expectedOtp);
    
    // Basic validation
    if (!enteredOtp || enteredOtp.length < 6) {
      setVerificationError('Invalid OTP: Please enter a valid 6-digit OTP');
      setIsVerifying(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          otp: enteredOtp,
          expectedOtp: expectedOtp
        })
      });

      const data = await response.json();
      console.log('OTP verification response:', data);
      
      if (data.success) {
        console.log('OTP verification successful');
        setOtpVerified(true);
        setCardVerificationStatus('success');
        setVerificationError("OTP verified successfully! Your payment will be marked as 'Paid' when you place the order.");
      } else {
        console.log('OTP verification failed:', data.message);
        setVerificationError(data.message || 'Invalid OTP. Please check and try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setVerificationError('Error verifying OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const steps = ['Delivery Address', 'Order Summary', 'Payment'];

  // Render content based on active step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!formData.firstName && error.includes('firstName')}
                helperText={!formData.firstName && error.includes('firstName') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!formData.lastName && error.includes('lastName')}
                helperText={!formData.lastName && error.includes('lastName') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={(!formData.email && error.includes('email')) || error.includes('valid email')}
                helperText={(!formData.email && error.includes('email')) ? 'Required field' : 
                  (error.includes('valid email') ? 'Enter valid email format' : '')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!formData.phone && error.includes('phone')}
                helperText={!formData.phone && error.includes('phone') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!formData.address && error.includes('address')}
                helperText={!formData.address && error.includes('address') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!formData.city && error.includes('city')}
                helperText={!formData.city && error.includes('city') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={!formData.state && error.includes('state')}
                helperText={!formData.state && error.includes('state') ? 'Required field' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Pin Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                error={!formData.pincode && error.includes('pincode')}
                helperText={!formData.pincode && error.includes('pincode') ? 'Required field' : ''}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            {cartItems.length === 0 ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Your cart is empty. Please add items to your cart before proceeding with checkout.
              </Alert>
            ) : (
              <>
            <Typography variant="h6" gutterBottom>
                  Order Summary
            </Typography>
                <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2 }}>
            {cartItems.map((item) => (
                    <Paper key={item._id} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 60, height: 60, mr: 2, overflow: 'hidden' }}>
                    <img
                          src={'http://localhost:5000' + item.imageUrl || '/default-product.png'} 
                      alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                          ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                    </Typography>
              </Box>
                    </Paper>
            ))}
                </Box>
            <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Subtotal</Typography>
                  <Typography variant="subtitle1">₹{getCartTotal()}</Typography>
            </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Shipping</Typography>
                  <Typography variant="subtitle1">₹0</Typography>
          </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">Tax</Typography>
                  <Typography variant="subtitle1">₹0</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">₹{getCartTotal()}</Typography>
                </Box>
              </>
            )}
          </>
        );
      case 2:
        return renderPaymentMethodSection();
      default:
        return null;
    }
  };

  // Add the renderCardDetailsForm function before renderPaymentMethodSection
  const renderCardDetailsForm = () => (
    <>
      <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
        Card Details
            </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Card Number"
              name="paymentDetails.cardNumber"
              value={formData.paymentDetails.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              error={!formData.paymentDetails.cardNumber && error.includes('card details')}
              helperText={!formData.paymentDetails.cardNumber && error.includes('card details') ? 'Card number is required' : ''}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: 'text.secondary' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </Box>
                ),
              }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Expiry Date"
            name="paymentDetails.cardExpiry"
            value={formData.paymentDetails.cardExpiry}
            onChange={handleChange}
            placeholder="MM/YY"
            error={!formData.paymentDetails.cardExpiry && error.includes('card details')}
            helperText={!formData.paymentDetails.cardExpiry && error.includes('card details') ? 'Expiry date is required' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="CVV"
            name="paymentDetails.cardCvv"
            value={formData.paymentDetails.cardCvv}
            onChange={handleChange}
            placeholder="123"
            type="password"
            error={!formData.paymentDetails.cardCvv && error.includes('card details')}
            helperText={!formData.paymentDetails.cardCvv && error.includes('card details') ? 'CVV is required' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Name on Card"
            name="paymentDetails.cardName"
            value={formData.paymentDetails.cardName || ''}
            onChange={handleChange}
            placeholder="John Smith"
            error={!formData.paymentDetails.cardName && error.includes('card details')}
            helperText={!formData.paymentDetails.cardName && error.includes('card details') ? 'Name on card is required' : ''}
          />
        </Grid>
        
        {/* Card Verification Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCardVerification}
            disabled={isVerifying || !formData.paymentDetails.cardNumber || 
                     !formData.paymentDetails.cardExpiry || 
                     !formData.paymentDetails.cardCvv || 
                     !formData.paymentDetails.cardName}
          >
            {isVerifying ? <CircularProgress size={24} /> : 'Verify Card'}
          </Button>
        </Grid>

        {/* Card Verification Status */}
        {cardVerificationStatus && (
          <Grid item xs={12}>
            <Alert 
              severity={cardVerificationStatus === 'success' ? 'success' : 'error'}
              sx={{ mt: 2 }}
            >
              {cardVerificationStatus === 'success' 
                ? 'Card verified successfully!' 
                : verificationError}
            </Alert>
          </Grid>
        )}

        {/* OTP Verification Section */}
        {otpSent && !otpVerified && (
          <>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Enter OTP sent to your registered email address
              </Typography>
              <TextField
                fullWidth
                required
                label="OTP"
                name="paymentDetails.otp"
                value={formData.paymentDetails.otp || ''}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                autoComplete="off"
                inputProps={{
                  maxLength: 6,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={handleOtpVerification}
                      disabled={isVerifying || !formData.paymentDetails.otp || formData.paymentDetails.otp.length < 6}
                    >
                      {isVerifying ? <CircularProgress size={24} /> : 'Verify OTP'}
                    </Button>
                  ),
                }}
                error={Boolean(verificationError && verificationError.includes('OTP'))}
                helperText={verificationError && verificationError.includes('OTP') ? 'Valid OTP is required' : ''}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && formData.paymentDetails.otp && formData.paymentDetails.otp.length === 6) {
                    e.preventDefault();
                    handleOtpVerification();
                  }
                }}
              />
            </Grid>
            {verificationError && !verificationError.includes('successfully') && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 2 }}>
                  {verificationError}
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleCardVerification}
                  disabled={isVerifying}
                  size="small"
                >
                  Resend OTP
                </Button>
          </Box>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                For testing, use the OTP shown in the verification message.
              </Typography>
            </Grid>
          </>
        )}

        {/* OTP Verification Success */}
        {otpVerified && (
          <Grid item xs={12}>
            <Alert severity="success" sx={{ mt: 2 }}>
              OTP verified successfully! Your payment will be marked as 'Paid' when you place the order.
            </Alert>
          </Grid>
        )}
      </Grid>
    </>
  );

  // Update the payment method section to include the card details form
  const renderPaymentMethodSection = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Select your preferred payment method for this order.
        </Typography>
        
        {/* Payment method grid */}
        <Grid container spacing={2}>
          {/* Cash on Delivery */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                border: '1px solid',
                borderColor: formData.paymentMethod === 'cod' ? 'primary.main' : 'divider',
                bgcolor: formData.paymentMethod === 'cod' ? 'primary.50' : 'background.paper',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    border: '2px solid',
                    borderColor: formData.paymentMethod === 'cod' ? 'primary.main' : 'grey.400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1
                  }}
                >
                  {formData.paymentMethod === 'cod' && (
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  )}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Cash on Delivery
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Pay with cash upon delivery
              </Typography>
            </Card>
          </Grid>
          
          {/* Credit/Debit Card */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                p: 2, 
                cursor: 'pointer',
                border: '1px solid',
                borderColor: formData.paymentMethod === 'card' ? 'primary.main' : 'divider',
                bgcolor: formData.paymentMethod === 'card' ? 'primary.50' : 'background.paper',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    borderRadius: '50%', 
                    border: '2px solid',
                    borderColor: formData.paymentMethod === 'card' ? 'primary.main' : 'grey.400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1
                  }}
                >
                  {formData.paymentMethod === 'card' && (
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main' }} />
                  )}
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Credit/Debit Card
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Pay securely with your card
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      
      {/* Payment Form Section */}
      <Grid item xs={12}>
        {formData.paymentMethod === 'card' && renderCardDetailsForm()}
      </Grid>
      
      {/* Order Summary */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">₹{getCartTotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Delivery Fee</Typography>
                <Typography variant="body2">₹{deliveryFee.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  ₹{(getCartTotal() + deliveryFee).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Checkout
      </Typography>
      
      {/* User Info Summary */}
      {userInfo && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {userInfo.firstName?.charAt(0) || userInfo.email?.charAt(0) || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Welcome, {userInfo.firstName || userInfo.name?.split(' ')[0] || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Logged in as: {userInfo.email}
              </Typography>
            </Grid>
            <Grid item>
              <Chip 
                label={fetchStatus.success ? "Data from backend" : "Using local data"} 
                color={fetchStatus.success ? "success" : "warning"}
                size="small"
              />
            </Grid>
          </Grid>
          
          {/* User Data Source */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              icon={<PersonIcon />} 
              label={`${formData.firstName || userInfo.firstName || ''} ${formData.lastName || userInfo.lastName || ''}`} 
              size="small" 
              variant="outlined"
            />
            <Chip 
              icon={<EmailIcon />} 
              label={formData.email || userInfo.email || ''} 
              size="small" 
              variant="outlined"
            />
            {(formData.phone || userInfo.phone) && (
              <Chip 
                icon={<PhoneIcon />} 
                label={formData.phone || userInfo.phone} 
                size="small" 
                variant="outlined"
              />
            )}
            {(formData.address || userInfo.address) && (
              <Chip 
                icon={<LocationOnIcon />} 
                label={`${formData.city || userInfo.city || ''}, ${formData.state || userInfo.state || ''}`} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>
          
          {/* User ID and Token Status */}
          <Box sx={{ mt: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
            <Typography variant="caption" display="block">
              User ID: {userId || userInfo.id || 'Unknown'}
            </Typography>
            <Typography variant="caption" display="block">
              Auth Status: {localStorage.getItem('token') ? 'Authenticated' : 'Not Authenticated'}
            </Typography>
          </Box>
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {validationError && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRetryValidation}
              disabled={isRetrying}
              startIcon={isRetrying ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                  <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                </svg>
              )}
            >
              {isRetrying ? 'Retrying...' : 'Retry Validation'}
            </Button>
          }
        >
          {validationError}
          {retryCount > 0 && <Typography variant="caption" display="block" sx={{ mt: 1 }}>Retry attempt: {retryCount}</Typography>}
        </Alert>
      )}

      {/* Stock refresh recommendation */}
      {showStockRefresh && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefreshCart}
              startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
              </svg>}
            >
              Refresh Cart
            </Button>
          }
        >
          Stock information may have changed. Please refresh the page to get the latest product information.
        </Alert>
      )}

      {loading && !error && activeStep === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
              {activeStep === 2 ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                  disabled={loading || cartItems.length === 0}
              >
                {loading ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
            ) : (
                <Button 
                  variant="contained" 
                  onClick={handleNext}
                  disabled={cartItems.length === 0 && activeStep === 1}
                >
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
      )}
    </Container>
  );
}

export default Checkout; 