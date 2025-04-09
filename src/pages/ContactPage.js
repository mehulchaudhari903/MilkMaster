import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

function ContactPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        // Send data to the backend
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'Not provided',
            company: formData.company,
            message: formData.message,
            status: 'unread',
            createdAt: new Date().toISOString()
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error submitting contact form');
        }
        
        console.log('Form data submitted successfully:', data);
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          message: ''
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrorMessage(error.message || 'There was an error sending your message. Please try again.');
        setSubmitError(true);
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSubmitted(false);
    setSubmitError(false);
  };
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              textAlign: 'center'
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 700,
              mx: 'auto',
              textAlign: 'center'
            }}
          >
            Get in touch with our sales team for personalized quotes and support
          </Typography>
        </Container>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -100, md: -150 },
            right: { xs: -100, md: -150 },
            width: { xs: 250, md: 400 },
            height: { xs: 250, md: 400 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: -100, md: -150 },
            left: { xs: -100, md: -150 },
            width: { xs: 250, md: 400 },
            height: { xs: 250, md: 400 },
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </Box>

      {/* Contact Form Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Send Us a Message
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Fill out the form below to get in touch with our sales team. We'll respond to your inquiry within 24 hours.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    variant="outlined"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company/Shop Name"
                    name="company"
                    variant="outlined"
                    value={formData.company}
                    onChange={handleChange}
                    error={!!errors.company}
                    helperText={errors.company}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    variant="outlined"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{ py: 1.5, px: 4, borderRadius: 2 }}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Card sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  Contact Information
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  You can also reach us directly using the following information.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ mr: 2 }}>
                      <LocationOnIcon color="primary" fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Our Location
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                      86V8+9P6, GJ SH 67, <br/> Kaprada, Gujarat 396126
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mb: 4 }}>
                    <Box sx={{ mr: 2 }}>
                      <PhoneIcon color="primary" fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Phone Number
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sales: +91 9825000000<br />
                        Support: +91 9825000000
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ mr: 2 }}>
                      <EmailIcon color="primary" fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Email Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        sales@milkmaster.com<br />
                        support@milkmaster.com
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" gutterBottom>
                  Business Hours
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  Monday - Friday: 8:00 AM - 6:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM<br />
                  Sunday: Closed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Map Section */}
      <Box sx={{ height: 450, width: '100%', mb: { xs: 0, md: 4 } }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1572.888085426987!2d73.21814968121554!3d20.342469481169605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0b3c617e926e9%3A0xdd549f404e4f321!2s86V8%2B9P6%2C%20GJ%20SH%2067%2C%20Kaprada%2C%20Gujarat%20396126!5e0!3m2!1sen!2sin!4v1744092512574!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Company Location"
        ></iframe>
      </Box>
      
      {/* Snackbars for form submission feedback */}
      <Snackbar open={submitted} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar open={submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage || 'There was an error sending your message. Please try again later.'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactPage; 