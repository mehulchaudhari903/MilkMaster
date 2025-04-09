import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Divider
} from '@mui/material';
import config from '../config';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${config.apiUrl}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Order not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Order Details
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <Typography>Order Number: {order.orderNumber}</Typography>
                  <Typography>Date: {formatDate(order.createdAt)}</Typography>
                  <Typography>
                    Status:{' '}
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Delivery Information
                  </Typography>
                  <Typography>Name: {order.deliveryAddress.name}</Typography>
                  <Typography>Address: {order.deliveryAddress.address}</Typography>
                  <Typography>City: {order.deliveryAddress.city}</Typography>
                  <Typography>State: {order.deliveryAddress.state}</Typography>
                  <Typography>Pincode: {order.deliveryAddress.pincode}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Unit Price</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 10 }}
                            />
                            <Typography>{item.product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              {/* Order Summary */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Subtotal</TableCell>
                      <TableCell>₹{order.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>GST (18%)</TableCell>
                      <TableCell>₹{order.gst.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Delivery Charges</TableCell>
                      <TableCell>₹{order.deliveryCharges.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Total</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">₹{order.total.toFixed(2)}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderDetails; 