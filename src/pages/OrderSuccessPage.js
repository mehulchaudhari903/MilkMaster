import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CheckCircleIcon,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <CheckCircleOutlineIcon 
          sx={{ 
            fontSize: 64,
            color: 'success.main',
            mb: 2
          }} 
        />
        
        <Typography variant="h4" gutterBottom>
          Order Placed Successfully!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your order. We have received your purchase request and will process it shortly.
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          A confirmation email has been sent to your registered email address.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/account/orders')}
          >
            View Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage; 