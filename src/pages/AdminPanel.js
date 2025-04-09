import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import products from '../data/products';

// Import both components
const AdminNavbar = lazy(() => import('../components/AdminNavbar'));
const AdminSidebar = lazy(() => import('../components/AdminSidebar'));
import AdminDashboard from '../components/AdminDashboard';

function AdminPanel() {
  const [currentTab, setCurrentTab] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productList, setProductList] = useState(products);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, []);

  
  // Mock data for orders
  const mockOrders = [
    { id: 1, customer: "Cafe Delight", date: "2023-03-10", status: "Delivered", total: 258.95 },
    { id: 2, customer: "Bakery Fresh", date: "2023-03-12", status: "Processing", total: 546.20 },
    { id: 3, customer: "Hotel Sunrise", date: "2023-03-14", status: "Pending", total: 1250.00 },
    { id: 4, customer: "Restaurant Elite", date: "2023-03-15", status: "Delivered", total: 789.50 },
    { id: 5, customer: "Grocery Mart", date: "2023-03-16", status: "Cancelled", total: 450.75 },
  ];

  // Mock data for users
  const mockUsers = [
    { id: 1, name: "John Doe", email: "john@cafedelight.com", role: "Customer", lastLogin: "2023-03-15" },
    { id: 2, name: "Jane Smith", email: "jane@bakeryfresh.com", role: "Customer", lastLogin: "2023-03-14" },
    { id: 3, name: "Admin User", email: "admin@milkmaster.com", role: "Admin", lastLogin: "2023-03-16" },
    { id: 4, name: "Sales Rep", email: "sales@milkmaster.com", role: "Staff", lastLogin: "2023-03-15" },
    { id: 5, name: "Support Agent", email: "support@milkmaster.com", role: "Staff", lastLogin: "2023-03-16" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEditProduct = (product) => {
    setEditingProduct({...product});
  };

  const handleSaveProduct = () => {
    setProductList(productList.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    ));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProductList(productList.filter(p => p.id !== id));
  };

  const handleProductFieldChange = (field, value) => {
    setEditingProduct({
      ...editingProduct,
      [field]: value
    });
  };

  const renderDashboard = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard Overview</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {productList.length}
              </Typography>
              <Typography variant="body2">
                Total Products
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {mockOrders.length}
              </Typography>
              <Typography variant="body2">
                Recent Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {mockUsers.filter(u => u.role === 'Customer').length}
              </Typography>
              <Typography variant="body2">
                Total Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Orders</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.slice(0, 3).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button size="small" onClick={() => setCurrentTab(2)}>View All Orders</Button>
        </Box>
      </Paper>

      {/* Low Stock Alert */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Low Stock Alert</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.filter(product => product.stock < 100).map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell align="right">{product.stock}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={() => {
                        setCurrentTab(1);
                        handleEditProduct(product);
                      }}
                    >
                      Restock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );

  const renderProducts = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
        >
          Add New Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productList.map((product) => (
              <TableRow key={product.id}>
                {editingProduct && editingProduct.id === product.id ? (
                  // Edit mode
                  <>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <TextField 
                        size="small" 
                        value={editingProduct.name}
                        onChange={(e) => handleProductFieldChange('name', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={editingProduct.category}
                          onChange={(e) => handleProductFieldChange('category', e.target.value)}
                        >
                          <MenuItem value="Milk">Milk</MenuItem>
                          <MenuItem value="Cheese">Cheese</MenuItem>
                          <MenuItem value="Yogurt">Yogurt</MenuItem>
                          <MenuItem value="Butter">Butter</MenuItem>
                          <MenuItem value="Cream">Cream</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField 
                        size="small" 
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => handleProductFieldChange('price', parseFloat(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField 
                        size="small" 
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => handleProductFieldChange('stock', parseInt(e.target.value))}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={handleSaveProduct}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => setEditingProduct(null)}>
                        <CancelIcon />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  // View mode
                  <>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEditProduct(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDeleteProduct(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderOrders = () => (
    <Box>
      <Typography variant="h4" gutterBottom>Order Management</Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={order.status}
                      size="small"
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderUsers = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
        >
          Add New User
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <>

     <Box className='min-h-screen bg-gray-50 py-8' sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Suspense fallback={<Box sx={{ width: 64 }} />}>
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </Suspense>
      <Box sx={{ 
        flexGrow: 1, 
        ml: { xs: 0, md: sidebarOpen ? '64px' : '20px' },
        transition: 'margin 0.3s ease-in-out',
        width: { xs: '100%', md: `calc(100% - ${sidebarOpen ? '64px' : '20px'})` },
      }}>
        {/* Re-enable the AdminNavbar */}
        <Suspense fallback={<Box sx={{ height: 64 }} />}>
          <AdminNavbar toggleSidebar={toggleSidebar} />
        </Suspense>
        
        
        <Box sx={{ p: 3, pt:'10px' , ml: !sidebarOpen ? '4%' : '12%' }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '10px' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 4 }}
            >
              <Tab label="Dashboard" />
              <Tab label="Products" />
              <Tab label="Orders" />
              <Tab label="Users" />
            </Tabs>

            {currentTab === 0 && renderDashboard()}
            {currentTab === 1 && renderProducts()}
            {currentTab === 2 && renderOrders()}
            {currentTab === 3 && renderUsers()}
          </Paper>
        </Box>
      </Box>
    </Box>
    </>
   
  );
}

export default AdminPanel; 