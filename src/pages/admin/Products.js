import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Snackbar,
  Alert,
  Chip,
  Box,
  TablePagination,
  Typography,
  Avatar,
  CircularProgress,
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import SyncIcon from '@mui/icons-material/Sync';
import config from '../../config';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openStockModal, setOpenStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState({
    id: '',
    name: '',
    currentStock: 0,
    newStock: 0,
    status: 'In Stock'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    minOrder: '',
    imageFile: null,
    imageUrl: '',
    imagePreview: '',
    category: '',
    features: [],
    stock: '',
    status: 'In Stock',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [newFeature, setNewFeature] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      // Auto-update status based on stock
      const updatedProducts = data.map(product => ({
        ...product,
        stock: product.stock || 0,
        status: product.status || determineStockStatus(product.stock || 0)
      }));
      
      setProducts(updatedProducts);
    } catch (error) {
      showSnackbar('Error fetching products', 'error');
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        imagePreview: product.imageUrl,
        features: Array.isArray(product.features) ? product.features : 
                 typeof product.features === 'string' ? JSON.parse(product.features) : []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        minOrder: '',
        imageFile: null,
        imageUrl: '',
        imagePreview: '',
        category: '',
        features: [],
        stock: '',
        status: 'In Stock',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for stock changes
    if (name === 'stock') {
      const stockValue = Number(value) || 0;
      const status = determineStockStatus(stockValue);
      
      setFormData(prev => ({
        ...prev,
        [name]: stockValue,
        status: status // Auto-update status based on stock
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size is less than 5MB
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar('Image size should be less than 5MB', 'error');
        return;
      }
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        showSnackbar('Please select an image file', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    try {
      setIsUploading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image
      const response = await fetch(`${config.apiUrl}/api/products`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar('Failed to upload image: ' + error.message, 'error');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct 
        ? `${config.apiUrl}/api/products/${editingProduct.id}`
        : `${config.apiUrl}/api/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Create FormData for the request
      const submitData = new FormData();
      
      // Auto-determine status based on stock
      const stock = Number(formData.stock) || 0;
      const status = determineStockStatus(stock);
      
      // Set current timestamp for updatedAt
      const now = new Date().toISOString();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'features') {
          // Ensure features is an array before stringifying
          const featuresArray = Array.isArray(formData[key]) ? formData[key] : [];
          submitData.append(key, JSON.stringify(featuresArray));
        } else if (key === 'createdAt' && !editingProduct) {
          // Only set createdAt for new products
          submitData.append(key, now);
        } else if (key === 'updatedAt') {
          // Always update the updatedAt timestamp
          submitData.append(key, now);
        } else if (key === 'status') {
          // Use the auto-determined status
          submitData.append(key, status);
        } else if (key !== 'imageFile' && key !== 'imagePreview') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append image file if it exists
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
        },
        body: submitData
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      showSnackbar(
        `Product ${editingProduct ? 'updated' : 'added'} successfully`,
        'success'
      );
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Error details:', error);
      showSnackbar('Error saving product: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      showSnackbar('Product deleted successfully', 'success');
      fetchProducts();
    } catch (error) {
      showSnackbar('Error deleting product', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleQuickStockUpdate = (product) => {
    setStockUpdateData({
      id: product.id,
      name: product.name,
      currentStock: Number(product.stock) || 0,
      newStock: Number(product.stock) || 0,
      status: product.status || 'In Stock'
    });
    setOpenStockModal(true);
  };

  const handleStockInputChange = (e) => {
    const { name, value } = e.target;
    setStockUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const determineStockStatus = (stockValue) => {
    const stock = Number(stockValue);
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const handleStockUpdate = async () => {
    try {
      const newStatus = stockUpdateData.status === 'Manual' 
        ? stockUpdateData.manualStatus 
        : determineStockStatus(stockUpdateData.newStock);
      
      // Create FormData for the request
      const submitData = new FormData();
      submitData.append('stock', stockUpdateData.newStock);
      submitData.append('status', newStatus);
      submitData.append('updatedAt', new Date().toISOString());
      
      const response = await fetch(`${config.apiUrl}/api/products/${stockUpdateData.id}`, {
        method: 'PUT',
        body: submitData
      });

      if (!response.ok) throw new Error('Failed to update stock');
      
      // Update the local products array
      setProducts(prev => prev.map(p => 
        p.id === stockUpdateData.id 
          ? { ...p, stock: stockUpdateData.newStock, status: newStatus, updatedAt: new Date().toISOString() } 
          : p
      ));

      showSnackbar('Stock updated successfully', 'success');
      setOpenStockModal(false);
    } catch (error) {
      showSnackbar('Error updating stock: ' + error.message, 'error');
    }
  };

  // Function to sync stock statuses with stock levels, useful for batch updates
  const syncStockStatuses = async () => {
    try {
      // First get all products with mismatched status
      const productsToUpdate = products.filter(product => {
        const currentStock = Number(product.stock) || 0;
        const expectedStatus = determineStockStatus(currentStock);
        return product.status !== expectedStatus;
      });
      
      if (productsToUpdate.length === 0) {
        showSnackbar('All product statuses are already in sync with stock levels', 'info');
        return;
      }
      
      // Confirm with the user
      if (!window.confirm(`${productsToUpdate.length} product(s) have status not matching their stock level. Update them?`)) {
        return;
      }
      
      // Track successes and failures
      let successCount = 0;
      let failureCount = 0;
      
      // Update each product
      const updatePromises = productsToUpdate.map(async (product) => {
        try {
          const expectedStatus = determineStockStatus(Number(product.stock) || 0);
          
          // Create FormData for the request
          const submitData = new FormData();
          submitData.append('status', expectedStatus);
          submitData.append('updatedAt', new Date().toISOString());
          
          const response = await fetch(`${config.apiUrl}/api/products/${product.id}`, {
            method: 'PUT',
            body: submitData
          });
          
          if (!response.ok) throw new Error(`Failed to update product ${product.name}`);
          
          successCount++;
          return true;
        } catch (error) {
          console.error(`Error updating ${product.name}:`, error);
          failureCount++;
          return false;
        }
      });
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Update the UI
      if (successCount > 0) {
        // Refresh the products list
        fetchProducts();
        
        showSnackbar(
          `Updated ${successCount} product statuses${failureCount > 0 ? `, ${failureCount} failed` : ''}`, 
          failureCount > 0 ? 'warning' : 'success'
        );
      } else if (failureCount > 0) {
        showSnackbar(`Failed to update ${failureCount} product statuses`, 'error');
      }
    } catch (error) {
      console.error('Error syncing stock statuses:', error);
      showSnackbar('Error syncing stock statuses', 'error');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<SyncIcon />}
            onClick={syncStockStatuses}
            disabled={products.length === 0}
          >
            Sync Stock Statuses
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            className="bg-primary-600"
            onClick={() => handleOpenModal()}
          >
            Add Product
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <Box className="p-4 text-center">
            <Typography variant="h6" color="text.secondary">
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm 
                ? "Try adjusting your search term" 
                : "Click 'Add Product' to create your first product"}
            </Typography>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>
                    <Tooltip title="Current stock quantity" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="inherit">Stock</Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Stock status is determined by quantity (0 = Out of Stock, ≤10 = Low Stock, >10 = In Stock)" arrow>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Status</span>
                        <InfoIcon fontSize="small" sx={{ ml: 0.5 }} />
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Avatar 
                        src={product.imageUrl.startsWith('http') 
                          ? product.imageUrl 
                          : `http://localhost:5000${product.imageUrl}`}
                        alt={product.name}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        {product.name.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell>
                      <Typography 
                        sx={{ 
                          color: Number(product.stock) <= 0 ? 'error.main' : 
                                Number(product.stock) <= 10 ? 'warning.main' : 
                                'success.main',
                          fontWeight: Number(product.stock) <= 10 ? 'bold' : 'normal'
                        }}
                      >
                        {product.stock || 0}
                        {Number(product.stock) <= 10 && (
                          <Tooltip title={Number(product.stock) <= 0 ? "Out of stock!" : "Low stock!"}>
                            <WarningIcon fontSize="small" color={Number(product.stock) <= 0 ? "error" : "warning"} sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                          </Tooltip>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'In Stock' 
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenModal(product)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(product.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color={product.status === 'In Stock' ? 'success' : 'warning'}
                          onClick={() => handleQuickStockUpdate(product)}
                          title="Quick stock update"
                        >
                          <InventoryIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Card>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <div className="space-y-4">
              <Box className="flex flex-col items-center mb-4">
                <div 
                  onClick={handleImageClick}
                  className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors mb-2 overflow-hidden"
                >
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10">
                      <CircularProgress size={24} color="primary" />
                    </div>
                  )}
                  {formData.imagePreview ? (
                    <img 
                      src={formData.imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <AddPhotoAlternateIcon fontSize="large" color="primary" />
                      <Typography variant="caption" color="textSecondary" align="center">
                        Click to upload image
                      </Typography>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Typography variant="caption" color="textSecondary">
                  Recommended size: 500x500px (Max: 5MB)
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={3}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                margin="normal"
                InputProps={{
                  startAdornment: '₹'
                }}
              />
              <TextField
                fullWidth
                label="Minimum Order"
                name="minOrder"
                type="number"
                value={formData.minOrder}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
                helperText="Enter the current stock quantity"
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 100 }}>
                  Status:
                </Typography>
                <Chip 
                  label={determineStockStatus(formData.stock || 0)} 
                  color={
                    Number(formData.stock) <= 0 ? 'error' :
                    Number(formData.stock) <= 10 ? 'warning' : 'success'
                  }
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  (Automatically determined based on stock level)
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Status Rules:
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="caption" color="error">
                    • Out of Stock: When stock is 0
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    • Low Stock: When stock is 10 or less
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    • In Stock: When stock is greater than 10
                  </Typography>
                </Stack>
              </Box>

              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                margin="normal"
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </TextField>
              
              <Box className="mt-4">
                <div className="flex gap-2 mb-2">
                  <TextField
                    fullWidth
                    label="Add Feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    size="small"
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleAddFeature}
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(formData.features) && formData.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleRemoveFeature(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </div>
              </Box>

              {editingProduct && (
                <Box className="mt-4 space-y-2">
                  <TextField
                    fullWidth
                    label="Created At"
                    value={new Date(formData.createdAt).toLocaleString()}
                    disabled
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Last Updated"
                    value={new Date(formData.updatedAt).toLocaleString()}
                    disabled
                    margin="normal"
                  />
                </Box>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <CircularProgress size={24} color="inherit" style={{ marginRight: 8 }} />
                  Uploading...
                </>
              ) : (
                editingProduct ? 'Update' : 'Add'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add the stock update dialog */}
      <Dialog open={openStockModal} onClose={() => setOpenStockModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Stock for {stockUpdateData.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
                  Current Stock:
                </Typography>
                <Chip 
                  label={stockUpdateData.currentStock} 
                  color={
                    stockUpdateData.currentStock <= 0 ? 'error' :
                    stockUpdateData.currentStock <= 10 ? 'warning' : 'success'
                  }
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
                  Current Status:
                </Typography>
                <Chip 
                  label={stockUpdateData.status} 
                  color={
                    stockUpdateData.status === 'Out of Stock' ? 'error' :
                    stockUpdateData.status === 'Low Stock' ? 'warning' : 'success'
                  }
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
                  New Stock:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Decrease stock">
                    <IconButton 
                      size="small"
                      onClick={() => setStockUpdateData(prev => ({
                        ...prev,
                        newStock: Math.max(0, Number(prev.newStock) - 1)
                      }))}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                  <TextField
                    type="number"
                    name="newStock"
                    value={stockUpdateData.newStock}
                    onChange={handleStockInputChange}
                    inputProps={{ min: 0 }}
                    sx={{ width: 100 }}
                  />
                  <Tooltip title="Increase stock">
                    <IconButton 
                      size="small"
                      onClick={() => setStockUpdateData(prev => ({
                        ...prev,
                        newStock: Number(prev.newStock) + 1
                      }))}
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              
              <FormControl component="fieldset">
                <FormLabel component="legend">Status Determination</FormLabel>
                <RadioGroup
                  row
                  name="statusMode"
                  value={stockUpdateData.status === 'Manual' ? 'Manual' : 'Automatic'}
                  onChange={(e) => {
                    if (e.target.value === 'Automatic') {
                      setStockUpdateData(prev => ({
                        ...prev,
                        status: determineStockStatus(prev.newStock)
                      }));
                    } else {
                      setStockUpdateData(prev => ({
                        ...prev,
                        status: 'Manual',
                        manualStatus: prev.status !== 'Manual' ? prev.status : 'In Stock'
                      }));
                    }
                  }}
                >
                  <FormControlLabel 
                    value="Automatic" 
                    control={<Radio />} 
                    label={
                      <Box>
                        <Typography variant="body2">Automatic</Typography>
                        <Typography variant="caption" color="text.secondary">
                          (Based on stock level: {determineStockStatus(stockUpdateData.newStock)})
                        </Typography>
                      </Box>
                    } 
                  />
                  <FormControlLabel 
                    value="Manual" 
                    control={<Radio />} 
                    label="Manual" 
                  />
                </RadioGroup>
              </FormControl>
              
              {stockUpdateData.status === 'Manual' && (
                <TextField
                  select
                  fullWidth
                  label="Manual Status"
                  name="manualStatus"
                  value={stockUpdateData.manualStatus || 'In Stock'}
                  onChange={(e) => {
                    setStockUpdateData(prev => ({
                      ...prev,
                      manualStatus: e.target.value
                    }));
                  }}
                >
                  <MenuItem value="In Stock">In Stock</MenuItem>
                  <MenuItem value="Low Stock">Low Stock</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
                  <MenuItem value="Coming Soon">Coming Soon</MenuItem>
                  <MenuItem value="Discontinued">Discontinued</MenuItem>
                </TextField>
              )}
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Typography variant="subtitle2" gutterBottom>
                  After Update:
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Chip 
                    label={`Stock: ${stockUpdateData.newStock}`}
                    color={
                      stockUpdateData.newStock <= 0 ? 'error' :
                      stockUpdateData.newStock <= 10 ? 'warning' : 'success'
                    }
                    size="small"
                  />
                  <Chip 
                    label={`Status: ${stockUpdateData.status === 'Manual' ? stockUpdateData.manualStatus : determineStockStatus(stockUpdateData.newStock)}`}
                    color={
                      (stockUpdateData.status === 'Manual' ? stockUpdateData.manualStatus : determineStockStatus(stockUpdateData.newStock)) === 'Out of Stock' ? 'error' :
                      (stockUpdateData.status === 'Manual' ? stockUpdateData.manualStatus : determineStockStatus(stockUpdateData.newStock)) === 'Low Stock' ? 'warning' : 'success'
                    }
                    size="small"
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStockModal(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStockUpdate} 
            variant="contained" 
            color="primary"
          >
            Update Stock
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Products;