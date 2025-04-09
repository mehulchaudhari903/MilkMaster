import React, { useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity,
    getCartTotal,
    getUserInfo
  } = useCart();

  // Filter cart items by user ID
  const getFilteredCartItems = () => {
    const userId = getUserInfo();
    if (!userId) return [];
    
    return cartItems.filter(item => item.userId === userId);
  };
  
  const userCartItems = getFilteredCartItems();

  const handleQuantityChange = (item, newQuantity) => {
    // Check if user is logged in
    const userId = getUserInfo();
    if (!userId) {
      navigate('/login');
      return;
    }

    if (newQuantity >= (item.minOrder || 1)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const userId = getUserInfo();
    if (!userId) {
      navigate('/login');
      return;
    }
    
    toggleCart(); // Close the cart
    navigate('/checkout'); // Navigate to checkout page
  };

  const handleRemoveFromCart = (itemId) => {
    // Check if user is logged in
    const userId = getUserInfo();
    if (!userId) {
      navigate('/login');
      return;
    }
    
    removeFromCart(itemId);
  };

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={toggleCart}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } }
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            Shopping Cart ({userCartItems.length})
          </Typography>
          <IconButton onClick={toggleCart} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Items */}
        {userCartItems.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            p: 3 
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Your cart is empty
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                toggleCart();
                navigate('/products');
              }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {userCartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                    {/* Product Image */}
                    <Box
                      component="img"
                      src={item.imageUrl ? `${config.apiUrl}${item.imageUrl}` : 'https://via.placeholder.com/100'}
                      alt={item.name}
                      sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                    />
                    
                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                      ₹{Number(item.price).toFixed(2)} / {item.unit}
                      </Typography>
                      
                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          disabled={item.quantity <= (item.minOrder || 1)}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(item, value);
                            }
                          }}
                          inputProps={{ 
                            min: item.minOrder || 1,
                            style: { textAlign: 'center', width: '40px' }
                          }}
                          variant="outlined"
                        />
                        <IconButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Price and Remove Button */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="subtitle1" component="div">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleRemoveFromCart(item.id)}
                        sx={{ mt: 'auto' }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Cart Summary and Checkout */}
        {userCartItems.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Divider />
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Subtotal:</Typography>
                <Typography variant="subtitle1">₹{Number(getCartTotal()).toFixed(2)}</Typography>
              </Box>
              
              <Alert severity="info" sx={{ py: 0 }}>
                Shipping calculated at checkout
              </Alert>

              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={handleCheckout}
                fullWidth
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                onClick={toggleCart}
                fullWidth
              >
                Continue Shopping
              </Button>
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ShoppingCart; 