import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  Chip,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import ReplyIcon from '@mui/icons-material/Reply';
import config from '../../config';

const Contact = () => {
  // State for contact messages
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected message and dialog
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Fetch contact messages from API
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${config.apiUrl}/api/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);
  
  // Handle opening message details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setOpenDialog(true);
  };
  
  // Close message dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Handle updating message status
  const handleUpdateStatus = async (messageId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${config.apiUrl}/api/contact/${messageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update message status');
      }
      
      // Update message in state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ));
      
      // Close dialog if open
      if (openDialog) {
        setOpenDialog(false);
      }
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Message status updated successfully',
        severity: 'success'
      });
      
      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Handle deleting a message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${config.apiUrl}/api/contact/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
      
      // Remove message from state
      setMessages(messages.filter(msg => msg.id !== messageId));
      
      // Close dialog if open
      if (openDialog && selectedMessage?.id === messageId) {
        setOpenDialog(false);
      }
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Message deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      setNotification({
        open: true,
        message: `Error: ${error.message}`,
        severity: 'error'
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'read':
        return 'success';
      case 'replied':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'unread':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Filter messages based on selected status
  const filteredMessages = messages.filter(message => 
    statusFilter === 'all' || message.status === statusFilter
  );
  
  // Count messages by status
  const messageCounts = {
    all: messages.length,
    unread: messages.filter(m => m.status === 'unread').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
    pending: messages.filter(m => m.status === 'pending').length
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Contact Message Management
      </Typography>
      
      {/* Status cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'primary.dark', 
              color: 'white',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => setStatusFilter('all')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">{messageCounts.all}</Typography>
                <EmailIcon fontSize="large" />
              </Box>
              <Typography variant="body2">Total Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => setStatusFilter('unread')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">{messageCounts.unread}</Typography>
                <EmailIcon fontSize="large" />
              </Box>
              <Typography variant="body2">Unread Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'success.main', 
              color: 'white',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => setStatusFilter('read')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">{messageCounts.read}</Typography>
                <MarkEmailReadIcon fontSize="large" />
              </Box>
              <Typography variant="body2">Read Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              bgcolor: 'info.main', 
              color: 'white',
              cursor: 'pointer',
              transition: '0.3s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
            onClick={() => setStatusFilter('replied')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">{messageCounts.replied}</Typography>
                <ReplyIcon fontSize="large" />
              </Box>
              <Typography variant="body2">Replied Messages</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filter controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {statusFilter === 'all' ? 'All Messages' : 
           statusFilter === 'unread' ? 'Unread Messages' :
           statusFilter === 'read' ? 'Read Messages' :
           statusFilter === 'replied' ? 'Replied Messages' :
           'Pending Messages'}
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Messages</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="replied">Replied</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredMessages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No messages found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Company</TableCell>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow 
                  key={message.id}
                  sx={{ 
                    cursor: 'pointer',
                    bgcolor: message.status === 'unread' ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                  onClick={() => handleViewMessage(message)}
                >
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.company}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={message.status} 
                      color={getStatusColor(message.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMessage(message);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      
                      {message.status !== 'read' && (
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(message.id, 'read');
                          }}
                        >
                          <MarkEmailReadIcon />
                        </IconButton>
                      )}
                      
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Message details dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedMessage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Message Details</Typography>
                <Chip 
                  label={selectedMessage.status} 
                  color={getStatusColor(selectedMessage.status)} 
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                {/* Sender info */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sender Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">{selectedMessage.name}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">{selectedMessage.email}</Typography>
                      </Box>
                      
                      {selectedMessage.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{selectedMessage.phone}</Typography>
                        </Box>
                      )}
                      
                      {selectedMessage.company && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body1">{selectedMessage.company}</Typography>
                        </Box>
                      )}
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Received: {formatDate(selectedMessage.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Message content */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Message
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body1" paragraph>
                        {selectedMessage.message}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Admin notes and status */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Admin Actions
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        <Button 
                          variant="contained" 
                          color="success" 
                          onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                          disabled={selectedMessage.status === 'read'}
                        >
                          Mark as Read
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                          disabled={selectedMessage.status === 'replied'}
                        >
                          Mark as Replied
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          color="warning" 
                          onClick={() => handleUpdateStatus(selectedMessage.id, 'pending')}
                          disabled={selectedMessage.status === 'pending'}
                        >
                          Mark as Pending
                        </Button>
                        
                        <Button 
                          variant="contained" 
                          color="error" 
                          onClick={() => handleDeleteMessage(selectedMessage.id)}
                        >
                          Delete Message
                        </Button>
                      </Box>
                      
                      <TextField
                        label="Admin Notes"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Add private notes about this message..."
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
