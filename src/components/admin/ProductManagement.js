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
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import products from '../../data/products';

function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);

  const handleOpenMenu = (event, product) => {
    setAnchorEl(event.currentTarget);
    setMenuProduct(product);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuProduct(null);
  };

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

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleDeleteProduct = (product) => {
    // In a real app, you would call an API to delete the product
    alert(`Delete product: ${product.name}`);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveProduct = () => {
    // In a real app, you would call an API to save the product
    alert(`Save product: ${currentProduct ? currentProduct.name : 'New Product'}`);
    setOpenDialog(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Product Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search products..."
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
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button startIcon={<FilterListIcon />}>
              Filter
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => {
              // Determine stock status
              let stockStatus = 'In Stock';
              let statusColor = 'success';
              
              if (product.stock <= 0) {
                stockStatus = 'Out of Stock';
                statusColor = 'error';
              } else if (product.stock <= 50) {
                stockStatus = 'Low Stock';
                statusColor = 'warning';
              }

              return (
                <TableRow key={product.id} hover>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: 1, 
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <img 
                        src={product.imageUrl || 'https://via.placeholder.com/50x50?text=Product'} 
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Chip 
                      label={stockStatus} 
                      size="small" 
                      color={statusColor}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small"
                      onClick={(event) => handleOpenMenu(event, product)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
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
      </TableContainer>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => handleEditProduct(menuProduct)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProduct(menuProduct)}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Product Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {currentProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                defaultValue={currentProduct?.name || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                fullWidth
                defaultValue={currentProduct?.category || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                fullWidth
                type="number"
                defaultValue={currentProduct?.price || ''}
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock Quantity"
                fullWidth
                type="number"
                defaultValue={currentProduct?.stock || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Unit"
                fullWidth
                defaultValue={currentProduct?.unit || ''}
                margin="normal"
                placeholder="e.g., per kg, per liter"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Minimum Order"
                fullWidth
                type="number"
                defaultValue={currentProduct?.minOrder || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                defaultValue={currentProduct?.imageUrl || ''}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                defaultValue={currentProduct?.description || ''}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductManagement; 