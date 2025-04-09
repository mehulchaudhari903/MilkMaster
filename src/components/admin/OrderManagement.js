import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Sample orders data
const orders = [
  { 
    id: 'ORD-2023-001', 
    customer: 'Coffee Corner Cafe', 
    date: '2023-03-10', 
    amount: 2450.80, 
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 1, name: 'Premium Full Cream Milk', price: 35.99, quantity: 40, total: 1439.60 },
      { id: 4, name: 'Bulk Mozzarella Cheese', price: 89.99, quantity: 10, total: 899.90 },
      { id: 5, name: 'Greek Yogurt', price: 59.99, quantity: 2, total: 119.98 }
    ],
    shippingAddress: '123 Coffee St, Café District, CA 91234',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah@coffeecorner.com',
    contactPhone: '(555) 123-4567'
  },
  { 
    id: 'ORD-2023-002', 
    customer: 'Bakery Delight', 
    date: '2023-03-09', 
    amount: 1350.50, 
    status: 'Processing',
    paymentStatus: 'Pending',
    items: [
      { id: 3, name: 'A2 Milk', price: 45.99, quantity: 20, total: 919.80 },
      { id: 7, name: 'Butter Blocks', price: 75.99, quantity: 6, total: 455.94 }
    ],
    shippingAddress: '456 Wheat Ave, Bakery Lane, NY 10001',
    contactPerson: 'Michael Brown',
    contactEmail: 'michael@bakerydelight.com',
    contactPhone: '(555) 987-6543'
  },
  { 
    id: 'ORD-2023-003', 
    customer: 'Sunrise Hotel', 
    date: '2023-03-08', 
    amount: 3240.00, 
    status: 'Pending',
    paymentStatus: 'Unpaid',
    items: [
      { id: 1, name: 'Premium Full Cream Milk', price: 35.99, quantity: 50, total: 1799.50 },
      { id: 5, name: 'Greek Yogurt', price: 59.99, quantity: 15, total: 899.85 },
      { id: 6, name: 'Whipping Cream', price: 49.99, quantity: 10, total: 499.90 }
    ],
    shippingAddress: '789 Sunrise Blvd, Hotel District, FL 33101',
    contactPerson: 'Emma Davis',
    contactEmail: 'emma@sunrisehotel.com',
    contactPhone: '(555) 456-7890'
  },
  { 
    id: 'ORD-2023-004', 
    customer: 'Fresh Foods Inc.', 
    date: '2023-03-07', 
    amount: 1780.25, 
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 2, name: 'Skim Milk', price: 32.99, quantity: 30, total: 989.70 },
      { id: 9, name: 'Buttermilk', price: 29.99, quantity: 25, total: 749.75 }
    ],
    shippingAddress: '101 Fresh St, Food District, WA 98101',
    contactPerson: 'David Wilson',
    contactEmail: 'david@freshfoods.com',
    contactPhone: '(555) 789-0123'
  },
  { 
    id: 'ORD-2023-005', 
    customer: 'The Cheese Factory', 
    date: '2023-03-06', 
    amount: 2150.00, 
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [
      { id: 4, name: 'Bulk Mozzarella Cheese', price: 89.99, quantity: 20, total: 1799.80 },
      { id: 8, name: 'Fresh Paneer', price: 69.99, quantity: 5, total: 349.95 }
    ],
    shippingAddress: '222 Cheese Way, Dairy Town, WI 53711',
    contactPerson: 'Jennifer Moore',
    contactEmail: 'jennifer@cheesefactory.com',
    contactPhone: '(555) 234-5678'
  }
];

function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailView, setDetailView] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleUpdateOrderStatus = (status) => {
    // In a real app, you would call an API to update the order status
    alert(`Order ${selectedOrder.id} status updated to: ${status}`);
    handleCloseDetailDialog();
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailView(true);
  };

  const handleBackToList = () => {
    setDetailView(false);
    setSelectedOrder(null);
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === '' || order.status === filterStatus)
  );

  // Apply pagination
  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Detail view component
  const OrderDetailView = () => (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBackToList}
          sx={{ mr: 2 }}
        >
          Back to Orders
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Order Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Order ID
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedOrder.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.date}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={selectedOrder.status} 
                  size="small"
                  color={
                    selectedOrder.status === 'Delivered' ? 'success' : 
                    selectedOrder.status === 'Processing' ? 'primary' : 
                    'warning'
                  }
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Payment Status
                </Typography>
                <Chip 
                  label={selectedOrder.paymentStatus} 
                  size="small"
                  color={
                    selectedOrder.paymentStatus === 'Paid' ? 'success' : 
                    selectedOrder.paymentStatus === 'Pending' ? 'warning' : 
                    'error'
                  }
                  variant="outlined"
                  sx={{ mt: 0.5 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedOrder.customer}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Shipping Address
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.shippingAddress}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Contact
                </Typography>
                <Typography variant="body1">
                  {selectedOrder.contactPerson} | {selectedOrder.contactPhone} | {selectedOrder.contactEmail}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${selectedOrder.amount.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Order Items */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              Order Items
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              {selectedOrder.items.map((item) => (
                <ListItem 
                  key={item.id}
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} x $${item.price.toFixed(2)}`}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    ${item.total.toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Update Order Status</InputLabel>
                <Select
                  label="Update Order Status"
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateOrderStatus(e.target.value)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipping">Shipping</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Generate Invoice
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // Orders list view
  const OrdersListView = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Order Management
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter by Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Delivered">Delivered</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<FilterListIcon />}>
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small"
                    color={
                      order.status === 'Delivered' ? 'success' : 
                      order.status === 'Processing' ? 'primary' : 
                      'warning'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentStatus} 
                    size="small"
                    color={
                      order.paymentStatus === 'Paid' ? 'success' : 
                      order.paymentStatus === 'Pending' ? 'warning' : 
                      'error'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small"
                    color="primary"
                    onClick={() => handleViewDetail(order)}
                    title="View details"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      {detailView && selectedOrder ? <OrderDetailView /> : <OrdersListView />}
    </Box>
  );
}

export default OrderManagement; 