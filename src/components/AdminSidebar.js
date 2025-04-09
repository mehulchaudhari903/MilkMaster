import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer, useTheme, useMediaQuery, Tooltip, Avatar, Badge } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';
import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import config from '../config';

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const adminName = adminData.name || 'Admin';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  const adminImage = adminData.profileImage;
  const logoImagePath = '/assets/image/icon.png';
  
  // State for unread messages count
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        const response = await fetch(`${config.apiUrl}/api/contact/count`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unread || 0);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Set up polling for updates
    const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      path: '/admin/products',
      name: 'Products',
      icon: <Inventory2Icon className="w-5 h-5" />
    },
    {
      path: '/admin/orders',
      name: 'Orders',
      icon: <ShoppingCartIcon className="w-5 h-5" />
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: <PeopleIcon className="w-5 h-5" />
    },
    {
      path: '/admin/contact',
      name: 'Contact',
      icon: 
        <Badge badgeContent={unreadCount} color="error" overlap="circular" variant="dot">
          <EmailIcon className="w-5 h-5" />
        </Badge>
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: <SettingsIcon className="w-5 h-5" />
    }
  ];

  const currentPath = location.pathname;

  const checkIsActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/admin';
  };

  const drawerContent = (
    <div className="flex flex-col h-full bg-white">
          {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-200 transition-all duration-300 ${
        isOpen ? 'px-6' : 'px-4'
          }`}>
        <div className="flex items-center">
          <div className={`flex items-center ${isOpen ? 'w-8 h-8' : 'w-6 h-6'}`}>
            <img 
              src={logoImagePath}
              alt="MilkMaster Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {isOpen && (
            <span className="ml-3 text-lg font-semibold text-[#1565C0] whitespace-nowrap">
              MilkMaster Admin
            </span>
          )}
        </div>
      </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
              {menuItems.map((item) => (
            <li key={item.path} className={!isOpen ? 'p-2' : 'p-0'}>
              {isOpen ? (
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center py-2 px-3 rounded-md transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                </NavLink>
              ) : (
                <Tooltip title={item.name} placement="right">
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center justify-center p-2 rounded-md transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                      {item.icon}
                  </NavLink>
                </Tooltip>
              )}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-200 ${!isOpen && 'text-center'}`}>
            {isOpen ? (
              <div className="flex items-center">
                <Avatar 
                  src={adminImage ? `${config.apiUrl}${adminImage}` : undefined}
                  alt={adminName}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main'
                  }}
                >
                  {!adminImage && adminInitials}
                </Avatar>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{adminName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{adminData.email}</p>
                </div>
              </div>
            ) : (
              <Avatar 
                src={adminImage ? `${config.apiUrl}${adminImage}` : undefined}
                alt={adminName}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  margin: '0 auto'
                }}
              >
                {!adminImage && adminInitials}
              </Avatar>
            )}
          </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity z-20"
          onClick={toggleSidebar}
        />
      )}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isOpen}
        onClose={toggleSidebar}
        sx={{
          width: isOpen ? 256 : 80,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? 256 : 80,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        className="transition-all duration-300"
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default AdminSidebar; 