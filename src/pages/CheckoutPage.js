import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  List,
  ListItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const validateShippingData = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (let field of required) {
      if (!shippingData[field]) {
        setError(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingData()) {
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Here you would typically:
      // 1. Process the payment
      // 2. Create the order in your backend
      // 3. Send confirmation email
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      clearCart();
      navigate('/order-success');
    } catch (err) {
      setError('Failed to process your order. Please try again.');
    }
    setLoading(false);
  };

  const subtotal = getCartTotal();
  const shipping = 10.00; // Example shipping cost
  const tax = subtotal * 0.1; // Example tax calculation (10%)
  const total = subtotal + shipping + tax;

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
                value={shippingData.firstName}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={shippingData.lastName}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={shippingData.email}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Phone"
                name="phone"
                value={shippingData.phone}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                value={shippingData.address}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingData.city}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                name="state"
                value={shippingData.state}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={shippingData.zipCode}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company (Optional)"
                name="company"
                value={shippingData.company}
                onChange={handleShippingChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Order Notes (Optional)"
                name="notes"
                multiline
                rows={4}
                value={shippingData.notes}
                onChange={handleShippingChange}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Payment Method</FormLabel>
            <RadioGroup
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <FormControlLabel 
                value="card" 
                control={<Radio />} 
                label="Credit/Debit Card" 
              />
              <FormControlLabel 
                value="bank" 
                control={<Radio />} 
                label="Bank Transfer" 
              />
              <FormControlLabel 
                value="cod" 
                control={<Radio />} 
                label="Cash on Delivery" 
              />
            </RadioGroup>
          </FormControl>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1" align="right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                  ₹{subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Shipping</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                  ₹{shipping.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Tax</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    ₹{tax.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                  ₹{total.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Place Order'
              )}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage; 