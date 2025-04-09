import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

function Orders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [orderNo, setOrderNo] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [cancelMessage, setCancelMessage] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [otherCancellationReason, setOtherCancellationReason] = useState('');
  const [orderCancellationSuccess, setOrderCancellationSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get current user ID from localStorage
        let userId = null;
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            userId = user.id || user._id;
            // console.log('Current user ID:', userId);
          }
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }

        const response = await fetch(`${config.apiUrl}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        // Convert total to number for each order and filter by user ID if available
        const processedOrders = data
          .map(order => ({
          ...order,
          total: Number(order.total)
          }))
          .filter(order => {
            // If we have a userId, only show orders for this user
            if (userId) {
              // Check various possible places where userId might be stored in the order
              const orderUserId = order.userId || (order.user && (order.user._id || order.user.id));
              // console.log(`Order ${order._id || order.id} userId:`, orderUserId);
              return orderUserId === userId;
            }
            return true; // If no userId, show all orders (fallback)
          });
        
        // console.log(`Fetched ${data.length} orders, displaying ${processedOrders.length} for user`);
        setOrders(processedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, currentUser]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <svg className="h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'shipped':
        return (
          <svg className="h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
          </svg>
        );
      case 'delivered':
      case 'complete':
        return (
          <svg className="h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'Cancelled':
        return (
          <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Apply filters and reset to first page
    setCurrentPage(1);
    console.log("Filtering with:", { orderNo, filterFrom, filterTo });
  };

  const clearFilters = () => {
    setOrderNo('');
    setFilterFrom('');
    setFilterTo('');
    setCurrentPage(1);
  };

  const filteredOrders = () => {
    return orders
      .filter(order => orderNo ? order.orderNumber?.includes(orderNo) : true)
      .filter(order => {
        if (!filterFrom) return true;
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filterFrom);
        return orderDate >= fromDate;
      })
      .filter(order => {
        if (!filterTo) return true;
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filterTo);
        return orderDate <= toDate;
      });
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders().slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders().length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
  };

  const orderCancell = (order) => {
    console.log("Cancelling order:", order);
    setSelectedOrder(order);
    setShowCancellationDialog(true);
    closeOrderDetails();
  };

  // Function to close cancellation dialog
  const closeCancellationDialog = () => {
    setShowCancellationDialog(false);
    setCancellationReason('');
    setOtherCancellationReason('');
  };

  // Update the handleCancelOrder function to handle different order ID formats
  const handleCancelOrder = async () => {
    if (!selectedOrder) {
      console.error('No order selected for cancellation');
      setCancelMessage({ 
        type: 'error', 
        text: 'No order selected for cancellation'
      });
      return;
    }
    
    // Get the order ID, supporting both id and _id formats
    const orderId = selectedOrder._id || selectedOrder.id;
    
    if (!orderId) {
      console.error('Selected order has no ID:', selectedOrder);
      setCancelMessage({ 
        type: 'error', 
        text: 'Invalid order selected for cancellation'
      });
      return;
    }
    
    console.log('Cancelling order with ID:', orderId);
    setCancellingOrder(true);
    setCancelMessage(null);
    
    let reason = cancellationReason;
    if (cancellationReason === 'Other' && otherCancellationReason) {
      reason = otherCancellationReason;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Log the request details for debugging
      console.log('Cancel request:', {
        url: `${config.apiUrl}/api/orders/${orderId}/cancel`,
        body: { cancellationReason: reason || 'Cancelled by customer' }
      });
      
      const response = await fetch(`${config.apiUrl}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancellationReason: reason || 'Cancelled by customer'
        })
      });

      const data = await response.json();
      console.log('Cancel response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }
      
      // Update the orders list with the cancelled order
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order._id === orderId || order.id === orderId) ? { ...order, status: 'Cancelled', paymentStatus: data.order.paymentStatus } : order
        )
      );
      
      // Update the selected order
      setSelectedOrder(prev => ({ 
        ...prev, 
        status: 'Cancelled',
        paymentStatus: data.order.paymentStatus,
        updatedAt: new Date().toISOString(),
        cancellationReason: reason || 'Cancelled by customer'
      }));
      
      // Set success messages for the main list
      let successMessage = `Order #${selectedOrder.orderNumber} has been cancelled successfully. Stock has been restored.`;
      
      // Add refund information if applicable
      if (data.order.paymentStatus === 'refunded') {
        successMessage += ' Payment has been marked for refund.';
      }
      
      setOrderCancellationSuccess({
        orderId: orderId,
        orderNumber: selectedOrder.orderNumber,
        message: successMessage
      });
      
      // Clear after 5 seconds
      setTimeout(() => {
        setOrderCancellationSuccess(null);
      }, 5000);
      
      // Close the cancellation dialog
      setShowCancellationDialog(false);
      
      setCancellationReason('');
      setOtherCancellationReason('');
    } catch (error) {
      console.error('Error cancelling order:', error);
      setCancelMessage({ 
        type: 'error', 
        text: error.message || 'Error cancelling order'
      });
    } finally {
      setCancellingOrder(false);
    }
  };

  // Update the openCancellationDialog function to handle different order ID formats
  const openCancellationDialog = (orderId) => {
    // Find the order in our list, supporting both id and _id formats
    const orderToCancel = orders.find(order => 
      (order._id === orderId || order.id === orderId)
    );
    
    if (!orderToCancel) {
      console.error('Order not found for cancellation:', orderId);
      return;
    }
    
    // Set the selected order 
    setSelectedOrder(orderToCancel);
    setShowCancellationDialog(true);
    setCancelMessage(null);
    closeOrderDetails();
  };

  // Add the status cell renderer function
  const renderStatusCell = (status) => (
    <span className={`px-2 py-1 inline-flex items-center rounded-full ${getStatusColor(status)}`}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      <span className="text-xs font-medium">{status}</span>
    </span>
  );

  // Enhance the renderCancellationDialog function with better UX
  const renderCancellationDialog = () => {
    if (!showCancellationDialog) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Cancel Order</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to cancel this order? This action cannot be undone.
                    </p>
                    <div className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                      <h4 className="text-sm font-medium text-yellow-800">What happens when you cancel:</h4>
                      <ul className="mt-2 text-xs text-yellow-700 list-disc pl-5 space-y-1">
                        <li>Your order will be marked as cancelled and will not be processed</li>
                        <li>Any reserved stock will be returned to the inventory</li>
                        <li>If payment was already processed, a refund will be initiated</li>
                        <li>You'll receive an email confirmation of the cancellation</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700">
                      Cancellation Reason <span className="text-gray-400">(Optional)</span>
                    </label>
                    <select
                      id="cancellationReason"
                      name="cancellationReason"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    >
                      <option value="">Select a reason</option>
                      <option value="Changed my mind">Changed my mind</option>
                      <option value="Found better price elsewhere">Found better price elsewhere</option>
                      <option value="Ordered by mistake">Ordered by mistake</option>
                      <option value="Delivery takes too long">Delivery takes too long</option>
                      <option value="Needs to be rescheduled">Needs to be rescheduled</option>
                      <option value="Other">Other</option>
                    </select>
                    {cancellationReason === 'Other' && (
                      <textarea
                        rows="2"
                        className="mt-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Please specify your reason"
                        value={otherCancellationReason}
                        onChange={(e) => setOtherCancellationReason(e.target.value)}
                      ></textarea>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
              >
                {cancellingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closeCancellationDialog}
                disabled={cancellingOrder}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Update the renderOrderDetailsModal function to show a more prominent cancel button
  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    // Check if order can be cancelled (only pending orders)
    const canBeCancelled = selectedOrder.status.toLowerCase() === 'pending';
    
    return (
      <div className={`fixed inset-0 z-50 overflow-y-auto ${showOrderDetails ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Order Details - #{selectedOrder.orderNumber}
                </h3>
                <button 
                  onClick={closeOrderDetails}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cancel message notification */}
              {cancelMessage && (
                <div className={`mb-4 p-4 rounded-md ${cancelMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {cancelMessage.text}
                </div>
              )}

              {/* Cancellation Action Banner for Pending Orders */}
              {canBeCancelled && (
                <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        This order can be cancelled
                      </h3>
                      <div className="mt-1 text-sm text-yellow-700">
                        <p>You can still cancel this order as it has not been shipped yet.</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => orderCancell(selectedOrder)}
                  >
                    <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Cancel Order
                  </button>
                </div>
              )}

              {/* Order status timeline */}
              <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      Order Status: {selectedOrder.status}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      {selectedOrder.status.toLowerCase() === 'Cancelled' ? (
                        <p>This order has been cancelled and will not be processed.</p>
                      ) : selectedOrder.status.toLowerCase() === 'delivered' || selectedOrder.status.toLowerCase() === 'complete' ? (
                        <p>This order has been completed and delivered successfully.</p>
                      ) : selectedOrder.status.toLowerCase() === 'shipped' ? (
                        <p>Your order is on its way to you!</p>
                      ) : selectedOrder.status.toLowerCase() === 'processing' ? (
                        <p>We're preparing your order for shipment.</p>
                      ) : (
                        <p>Your order has been received and is being reviewed.</p>
                      )}
                    </div>
                    {selectedOrder.updatedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Last updated: {formatDate(selectedOrder.updatedAt)}
                      </p>
                    )}
                    {selectedOrder.cancellationReason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-700">
                        <strong>Cancellation Reason:</strong> {selectedOrder.cancellationReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                {/* Order status and date section */}
                <div className="flex flex-wrap justify-between mb-6">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-500">Status</p>
                    {renderStatusCell(selectedOrder.status)}
                  </div>
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                      selectedOrder.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800' :
                      selectedOrder.paymentStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Customer information */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {selectedOrder.deliveryAddress ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Customer Name</p>
                          <p className="text-sm font-medium">{selectedOrder.deliveryAddress.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-sm font-medium">{selectedOrder.deliveryAddress.email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-sm font-medium">{selectedOrder.deliveryAddress.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="text-sm font-medium">
                            {selectedOrder.deliveryAddress.address || ''}, 
                            {selectedOrder.deliveryAddress.city || ''}, 
                            {selectedOrder.deliveryAddress.state || ''} - 
                            {selectedOrder.deliveryAddress.pincode || ''}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No delivery address information available</p>
                    )}
                  </div>
                </div>

                {/* Order items */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <tr key={`${selectedOrder._id || selectedOrder.id}-item-${index}-${item.productId || item.id || ''}`} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {item.imageUrl && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img 
                                      className="h-10 w-10 rounded object-cover" 
                                      src={item.imageUrl ? `${config.apiUrl}${item.imageUrl}` : '/default-product.png'} 
                                      alt={item.name} 
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ₹{Number(item.price).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Order summary */}
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-end">
                    <div className="w-full md:w-1/3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm font-medium">₹{selectedOrder.total ? Number(selectedOrder.total).toFixed(2) : '0.00'}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Shipping</span>
                        <span className="text-sm font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-base font-medium">Total</span>
                        <span className="text-base font-bold">₹{selectedOrder.total ? Number(selectedOrder.total).toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closeOrderDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Function to render page buttons with ellipsis
    const renderPageButtons = () => {
      const pageNumbers = [];
      
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate range of pages to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add page numbers around current page
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page if more than one page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
      
      return pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700">
              ...
            </span>
          );
        }
        
        return (
          <button
            key={`page-${page}`}
            onClick={() => paginate(page)}
            className={`relative inline-flex items-center px-4 py-2 border ${
              currentPage === page
                ? "bg-blue-50 border-blue-500 text-blue-600 z-10"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            } text-sm font-medium`}
          >
            {page}
          </button>
        );
      });
    };

    return (
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 mr-4">
            Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastOrder, filteredOrders().length)}
            </span>{" "}
            of <span className="font-medium">{filteredOrders().length}</span> orders
          </span>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-700">Show</span>
            <select
              value={ordersPerPage}
              onChange={handlePerPageChange}
              className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2 text-sm text-gray-700">per page</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
              currentPage === 1
                ? "border-gray-300 bg-white text-gray-300 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          
          <div className="hidden md:flex">
            {renderPageButtons()}
          </div>
          
          <div className="md:hidden">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-md border ${
              currentPage === totalPages
                ? "border-gray-300 bg-white text-gray-300 cursor-not-allowed"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return orderNo || filterFrom || filterTo;
  };

  // Get the count of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (orderNo) count++;
    if (filterFrom) count++;
    if (filterTo) count++;
    return count;
  };

  // Render active filters summary
  const renderActiveFilters = () => {
    if (!hasActiveFilters()) return null;
    
    return (
      <div className="mb-6 bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-blue-800">
            <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Filtered by:</span>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            Clear all
            <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {orderNo && (
            <div className="inline-flex items-center bg-white border border-blue-200 rounded-full py-1 pl-3 pr-2 text-sm text-blue-700">
              Order: {orderNo}
              <button 
                onClick={() => setOrderNo('')} 
                className="ml-1 rounded-full bg-blue-100 p-1 hover:bg-blue-200"
              >
                <svg className="h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {filterFrom && (
            <div className="inline-flex items-center bg-white border border-blue-200 rounded-full py-1 pl-3 pr-2 text-sm text-blue-700">
              From: {new Date(filterFrom).toLocaleDateString()}
              <button 
                onClick={() => setFilterFrom('')} 
                className="ml-1 rounded-full bg-blue-100 p-1 hover:bg-blue-200"
              >
                <svg className="h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {filterTo && (
            <div className="inline-flex items-center bg-white border border-blue-200 rounded-full py-1 pl-3 pr-2 text-sm text-blue-700">
              To: {new Date(filterTo).toLocaleDateString()}
              <button 
                onClick={() => setFilterTo('')} 
                className="ml-1 rounded-full bg-blue-100 p-1 hover:bg-blue-200"
              >
                <svg className="h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order history</h1>

      {/* Success notification */}
      {orderCancellationSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {orderCancellationSuccess.message}
              </p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  onClick={() => setOrderCancellationSuccess(null)} 
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Showing orders for {currentUser.firstName} {currentUser.lastName} ({currentUser.email})
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Filter section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:space-x-4">
          <div className="sm:w-1/4">
            <label htmlFor="orderNo" className="block text-sm font-medium text-gray-700 mb-1">Order no.</label>
            <input
              type="text"
              id="orderNo"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-1/4">
            <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              id="from"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-1/4">
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              id="to"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:w-1/4 flex space-x-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Search
            </button>
            
            {(orderNo || filterFrom || filterTo) && (
              <button
                type="button"
                onClick={clearFilters}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Recent orders
        {hasActiveFilters() && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getActiveFilterCount()} {getActiveFilterCount() === 1 ? 'filter' : 'filters'} active
          </span>
        )}
      </h2>

      {/* Show active filters summary */}
      {renderActiveFilters()}

      {filteredOrders().length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          {hasActiveFilters() ? (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg font-medium mb-2">No orders match your filters</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your search criteria or clear the filters to see all orders.</p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg font-medium mb-2">No orders found</p>
              <p className="text-gray-400 text-sm mb-4">You haven't placed any orders yet. Start shopping to place your first order!</p>
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start Shopping
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order no.
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill to name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order._id || order.id || `order-${order.orderNumber}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.deliveryAddress?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusCell(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          View Details
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
        </div>
      )}

      {/* Render the cancellation dialog */}
      {renderCancellationDialog()}
      
      {/* Order details modal */}
      {renderOrderDetailsModal()}
    </div>
  );
}

export default Orders; 