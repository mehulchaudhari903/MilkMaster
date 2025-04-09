import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminDashboard from '../components/admin/AdminDashboard';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render the appropriate component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} lg={2}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                height: '100%',
                borderRadius: 2
              }}
            >
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  p: 2, 
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Admin Panel
              </Typography>
              <Divider />
              <List>
                <ListItem 
                  button 
                  onClick={() => setActiveTab('dashboard')}
                  selected={activeTab === 'dashboard'}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': { 
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.light' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon color={activeTab === 'dashboard' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab('products')}
                  selected={activeTab === 'products'}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': { 
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.light' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <InventoryIcon color={activeTab === 'products' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Products" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab('orders')}
                  selected={activeTab === 'orders'}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': { 
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.light' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <ShoppingCartIcon color={activeTab === 'orders' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Orders" />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => setActiveTab('users')}
                  selected={activeTab === 'users'}
                  sx={{ 
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': { 
                      backgroundColor: 'primary.light',
                      color: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.light' }
                    }
                  }}
                >
                  <ListItemIcon>
                    <PeopleIcon color={activeTab === 'users' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem button>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          {/* Main Content */}
          <Grid item xs={12} md={9} lg={10}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                minHeight: '80vh',
                borderRadius: 2
              }}
            >
              {renderContent()}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AdminPage; 