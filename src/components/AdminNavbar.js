import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import config from '../config';



function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const adminName = adminData.name || 'Admin';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  const adminImage = adminData.profileImage;

  useEffect(() => {
    fetchUnreadMessages();
    
    // Poll for new messages every minute
    const interval = setInterval(fetchUnreadMessages, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      // Fetch unread contact messages count
      // const countResponse = await fetch('http://localhost:5000/api/contact/count', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // if (countResponse.ok) {
      //   const countData = await countResponse.json();
      //   setUnreadCount(countData.unread || 0);
      // }
      
      // Fetch all contact messages
      const messagesResponse = await fetch(`${config.apiUrl}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        // Sort by date (newest first) and take the 5 most recent
        const recentMessages = messagesData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(message => ({
            id: message.id,
            title: `${message.name} sent a message`,
            content: message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message,
            time: new Date(message.createdAt).toLocaleString(),
            isUnread: message.status === 'unread',
            type: 'contact'
          }));
        
        setNotifications(recentMessages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    
    // Mark unread messages as read when notification menu is opened
    const unreadMessageIds = notifications
      .filter(notification => notification.isUnread)
      .map(notification => notification.id);
      
    if (unreadMessageIds.length > 0) {
      markMessagesAsRead(unreadMessageIds);
    }
  };

  const markMessagesAsRead = async (messageIds) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      const response = await fetch(`${config.apiUrl}/api/contact/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messageIds })
      });
      
      if (response.ok) {
        // Update local state to reflect read status
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            messageIds.includes(notification.id) 
              ? { ...notification, isUnread: false } 
              : notification
          )
        );
        
        // Update unread count
        setUnreadCount(prevCount => Math.max(0, prevCount - messageIds.length));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/admin/settings');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/admin/settings');
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'contact') {
      navigate('/admin/contact');
    }
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
      className="transition-all duration-300"
    >
      <Toolbar className="px-2 md:px-6">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
          className="truncate text-[#1565C0] font-bold"
        >
         
        </Typography>

        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleNotificationMenuOpen}
              size={isMobile ? "small" : "medium"}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: '16px',
                    minWidth: '16px'
                  }
                }}
              >
                <NotificationsIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title={adminName}>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              size={isMobile ? "small" : "medium"}
            >
              <Avatar 
                src={adminImage ? `${config.apiUrl}${adminImage}` : undefined}
                alt={adminName}
                sx={{ 
                  width: isMobile ? 28 : 32, 
                  height: isMobile ? 28 : 32,
                  bgcolor: 'primary.main'
                }}
              >
                {!adminImage && adminInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </div>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1.5,
              minWidth: 180,
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                py: 1
              }
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} disabled>
            <div className="flex items-center space-x-2 w-full">
              <Avatar 
                src={adminImage ? `${config.apiUrl}${adminImage}` : undefined}
                alt={adminName}
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              >
                {!adminImage && adminInitials}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{adminName}</span>
                <span className="text-xs text-gray-500">{adminData.email}</span>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1.5,
              minWidth: 280,
              maxWidth: '90vw',
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                py: 1.5,
                px: 2,
                whiteSpace: 'normal'
              }
            }
          }}
        >
          {notifications.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <Typography variant="subtitle2" className="font-medium">Notifications</Typography>
              </div>
              {notifications.map((notification, index) => (
                <MenuItem 
                  key={`notification-${index}`} 
                  onClick={() => handleNotificationClick(notification)} 
                  sx={{
                    backgroundColor: notification.isUnread ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: notification.isUnread ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  className="flex flex-col items-start"
                >
                  <div className="flex w-full justify-between">
                    <span className="font-medium">{notification.title}</span>
                    {notification.isUnread && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-2"></span>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 mt-1">{notification.content}</span>
                  <span className="text-xs text-gray-500 mt-1 self-end">{notification.time}</span>
                </MenuItem>
              ))}
              <div className="px-4 py-2 border-t border-gray-200 text-center">
                <Typography 
                  variant="body2" 
                  className="text-primary-600 cursor-pointer hover:underline"
                  onClick={() => {
                    handleMenuClose();
                    navigate('/admin/contact');
                  }}
                >
                  View All Messages
                </Typography>
              </div>
            </>
          ) : (
            <MenuItem onClick={handleMenuClose} className="flex flex-col items-center py-4">
              <span className="text-gray-500">No new notifications</span>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavbar; 