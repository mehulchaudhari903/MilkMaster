import React from 'react';
import { Box, Grid, Paper, Typography, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { 
  ShoppingCartOutlined, 
  InventoryOutlined, 
  PeopleOutlined, 
  MonetizationOnOutlined 
} from '@mui/icons-material';

// Sample data for the dashboard
const summaryData = [
  { title: 'Total Sales', value: '$125,430', icon: <MonetizationOnOutlined sx={{ fontSize: 40 }} color="primary" />, change: '+15%' },
  { title: 'Total Orders', value: '543', icon: <ShoppingCartOutlined sx={{ fontSize: 40 }} color="primary" />, change: '+12%' },
  { title: 'Total Products', value: '48', icon: <InventoryOutlined sx={{ fontSize: 40 }} color="primary" />, change: '+3%' },
  { title: 'Total Customers', value: '128', icon: <PeopleOutlined sx={{ fontSize: 40 }} color="primary" />, change: '+8%' }
];

// Sample recent orders
const recentOrders = [
  { id: 'ORD-2023-001', customer: 'Coffee Corner Cafe', date: '2023-03-10', amount: '$2,450.80', status: 'Delivered' },
  { id: 'ORD-2023-002', customer: 'Bakery Delight', date: '2023-03-09', amount: '$1,350.50', status: 'Processing' },
  { id: 'ORD-2023-003', customer: 'Sunrise Hotel', date: '2023-03-08', amount: '$3,240.00', status: 'Pending' },
  { id: 'ORD-2023-004', customer: 'Fresh Foods Inc.', date: '2023-03-07', amount: '$1,780.25', status: 'Delivered' },
  { id: 'ORD-2023-005', customer: 'The Cheese Factory', date: '2023-03-06', amount: '$2,150.00', status: 'Delivered' }
];

// Stock alerts
const stockAlerts = [
  { product: 'Premium Full Cream Milk', stock: 45, status: 'Low' },
  { product: 'Bulk Mozzarella Cheese', stock: 20, status: 'Low' },
  { product: 'Greek Yogurt', stock: 15, status: 'Critical' }
];

function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Welcome to your dairy business dashboard. Here's what's happening with your store today.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Box>
                <Typography variant="h6" component="div" color="text.secondary" fontWeight="normal">
                  {item.title}
                </Typography>
                <Typography variant="h4" component="div" fontWeight="medium" sx={{ mt: 1 }}>
                  {item.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  component="span" 
                  color="success.main" 
                  sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                >
                  {item.change} this month
                </Typography>
              </Box>
              <Box sx={{ ml: 2 }}>
                {item.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              Recent Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ overflow: 'auto' }}>
              <Box sx={{ minWidth: 600 }}>
                <Box sx={{ display: 'flex', fontWeight: 'bold', py: 1, bgcolor: 'background.default', px: 2 }}>
                  <Box sx={{ flex: '0 0 15%' }}>Order ID</Box>
                  <Box sx={{ flex: '0 0 30%' }}>Customer</Box>
                  <Box sx={{ flex: '0 0 20%' }}>Date</Box>
                  <Box sx={{ flex: '0 0 15%' }}>Amount</Box>
                  <Box sx={{ flex: '0 0 20%' }}>Status</Box>
                </Box>
                
                <List disablePadding>
                  {recentOrders.map((order, index) => (
                    <ListItem 
                      key={order.id} 
                      sx={{ 
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        py: 1,
                        px: 2,
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <Box sx={{ flex: '0 0 15%' }}>
                          <Typography variant="body2" color="primary">
                            {order.id}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 30%' }}>
                          <Typography variant="body2">
                            {order.customer}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 20%' }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.date}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 15%' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {order.amount}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '0 0 20%' }}>
                          <Chip 
                            label={order.status} 
                            size="small"
                            color={
                              order.status === 'Delivered' ? 'success' : 
                              order.status === 'Processing' ? 'primary' : 
                              'warning'
                            }
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Stock Alerts */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3,
              borderRadius: 2,
              height: '100%'
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
              Low Stock Alerts
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {stockAlerts.map((item, index) => (
                <ListItem 
                  key={index}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: item.status === 'Critical' ? 'error.light' : 'warning.light'
                  }}
                >
                  <ListItemText
                    primary={item.product}
                    secondary={`Stock: ${item.stock} units`}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                  <Chip 
                    label={item.status}
                    size="small"
                    color={item.status === 'Critical' ? 'error' : 'warning'}
                  />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              3 products need your attention
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard; 