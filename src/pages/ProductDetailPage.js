import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Breadcrumbs,
  Link,
  IconButton,
  Alert,
  useMediaQuery,
  useTheme,
  CircularProgress
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import products from '../data/products';
import { useCart } from '../context/CartContext';
import config from '../config';

// Placeholder image for products without images
const placeholderImage = 'https://via.placeholder.com/600x400?text=Dairy+Product';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useCart();
  
  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addToCartStatus, setAddToCartStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Add stock status function
  const getStockStatus = () => {
    if (!product) return { text: 'Loading...', color: 'default' };
    if (product.stock > 100) return { text: 'In Stock', color: 'success' };
    if (product.stock > 0) return { text: 'Low Stock', color: 'warning' };
    return { text: 'Out of Stock', color: 'error' };
  };

  const stockStatus = getStockStatus();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${config.apiUrl}/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        
        // Parse features if it's a string
        if (data.features && typeof data.features === 'string') {
          try {
            data.features = JSON.parse(data.features);
          } catch (e) {
            data.features = [];
          }
        }
        
        setProduct(data);
        // Set initial quantity to 1
        setQuantity(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const value = parseFloat(event.target.value);
    const maxStock = product?.stock || 0;
    
    if (!isNaN(value)) {
      const wholeValue = Math.floor(value);
      if (wholeValue >= 1 && wholeValue <= maxStock) {
        setQuantity(wholeValue);
      }
    }
  };

  // Increment quantity
  const incrementQuantity = () => {
    const maxStock = product?.stock || 0;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Update handleAddToCart function
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product) return;
    
    // Check if product is out of stock
    if (product.stock <= 0) {
      setAddToCartStatus({
        loading: false,
        success: false,
        error: 'Product is out of stock'
      });
      return;
    }
    
    // Check if requested quantity exceeds available stock
    if (quantity > product.stock) {
      setAddToCartStatus({
        loading: false,
        success: false,
        error: `Only ${product.stock} available in stock`
      });
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { 
        state: { 
          from: `/products/${product._id}`,
          message: 'Please login to add items to cart'
        }
      });
      return;
    }

    // Set loading state
    setAddToCartStatus({
      loading: true,
      success: false,
      error: null
    });

    try {
      // Get user ID from localStorage
      let userId = null;
      try {
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        userId = userInfo.id;
        
        if (!userId && token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          userId = JSON.parse(jsonPayload).userId;
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        throw new Error('Failed to get user information');
      }

      const productWithQuantity = {
        ...product,
        quantity: quantity,
        userId: userId,
        totalQuantity: quantity.toString(),
        remainingStock: product.stock - quantity
      };
      
      // Add to cart
      const result = await addToCart(productWithQuantity);
      
      if (result.success) {
        // Set success state
        setAddToCartStatus({
          loading: false,
          success: true,
          error: null
        });

        // Reset success message after 3 seconds
        setTimeout(() => {
          setAddToCartStatus(prev => ({
            ...prev,
            success: false
          }));
        }, 3000);
      } else {
        // Set error state with stock information
        setAddToCartStatus({
          loading: false,
          success: false,
          error: result.message.includes('stock') 
            ? `Only ${product.stock} available in stock`
            : result.message
        });
      }

    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddToCartStatus({
        loading: false,
        success: false,
        error: 'Failed to add product to cart. Please try again.'
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <div className="animate-pulse">
          {/* Breadcrumbs skeleton */}
          <div className="flex gap-2 items-center mb-6">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded-full w-3"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded-full w-3"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product image skeleton */}
            <div className="bg-gray-300 rounded-lg aspect-[4/3] w-full"></div>
            
            {/* Product details skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              
              {/* Rating skeleton */}
              <div className="flex gap-2 items-center">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              
              {/* Price skeleton */}
              <div className="h-8 bg-gray-300 rounded w-1/3 mt-2"></div>
              
              {/* Description skeleton */}
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-4/6"></div>
              </div>
              
              {/* Features skeleton */}
              <div className="mt-4">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-[1px] bg-gray-200 my-6"></div>
              
              {/* Quantity selector skeleton */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-48"></div>
              </div>
              
              {/* Add to cart button skeleton */}
              <div className="h-12 bg-gray-300 rounded-md w-full mt-4"></div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {error === 'Product not found' ? 'Product Not Found' : 'Error'}
        </Typography>
        <Typography variant="body1" paragraph>
          {error === 'Product not found' 
            ? 'The product you\'re looking for doesn\'t exist or has been removed.'
            : 'There was an error loading the product. Please try again later.'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  // Show not found state
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Product Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The product you're looking for doesn't exist or has been removed.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/products')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  // Related products (products in the same category)
  const relatedProducts = products
    .filter(p => {
      // Parse features for related products if needed
      if (p.features && typeof p.features === 'string') {
        try {
          p.features = JSON.parse(p.features);
        } catch (e) {
          p.features = [];
        }
      }
      return p?.category === product?.category && p?.id !== product?.id;
    })
    .slice(0, 4);

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link 
            color="inherit" 
            href="/" 
            onClick={(e) => { e.preventDefault(); navigate('/'); }}
          >
            Home
          </Link>
          <Link 
            color="inherit" 
            href="/products" 
            onClick={(e) => { e.preventDefault(); navigate('/products'); }}
          >
            Products
          </Link>
          <Link 
            color="inherit" 
            href={`/products?category=${product?.category?.toLowerCase() || ''}`} 
            onClick={(e) => { e.preventDefault(); navigate(`/products?category=${product?.category?.toLowerCase() || ''}`); }}
          >
            {product?.category || 'Uncategorized'}
          </Link>
          <Typography color="text.primary">{product?.name || 'Unknown Product'}</Typography>
        </Breadcrumbs>

        {/* Back Button - Mobile Only */}
        {isMobile && (
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        )}

        {/* Product Details */}
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product?.imageUrl ? `${config.apiUrl}${product.imageUrl}` : placeholderImage}
              alt={product?.name || 'Product Image'}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                mb: 2
              }}
            />
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ mb: 1 }}>
                <Chip 
                  label={product?.category || 'Uncategorized'} 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                {product?.name || 'Unknown Product'}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  4.5 (24 reviews)
                </Typography>
              </Box>

              <Typography variant="h4" color="primary.main" gutterBottom>
                ₹{Number(product?.price || 0).toFixed(2)}
              </Typography>

              <Typography variant="body1" paragraph sx={{ my: 2 }}>
                {product?.description || 'No description available.'}
              </Typography>

              {/* Features */}
              {product?.features?.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
                    Key Features
                  </Typography>
                  <List dense disablePadding>
                    {product.features.map((feature, index) => (
                      <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleOutlineIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Add to Cart Section */}
              <Box sx={{ mt: 'auto' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        Quantity:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton 
                          size="small" 
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={quantity}
                          onChange={handleQuantityChange}
                          inputProps={{ 
                            min: 1,
                            max: product?.stock || 0,
                            step: 1,
                            style: { textAlign: 'center' }
                          }}
                          variant="outlined"
                          size="small"
                          disabled={product?.stock <= 0}
                          sx={{ width: 70, mx: 1 }}
                        />
                        <IconButton 
                          size="small" 
                          onClick={incrementQuantity}
                          disabled={quantity >= (product?.stock || 0)}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Available stock: {product?.stock || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      disabled={product?.stock <= 0 || addToCartStatus.loading}
                      sx={{ 
                        py: 1.5, 
                        borderRadius: 2,
                        ...(product?.stock <= 0 && {
                          backgroundColor: 'rgba(0, 0, 0, 0.12)',
                          color: 'rgba(0, 0, 0, 0.26)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                          }
                        })
                      }}
                    >
                      {addToCartStatus.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : product?.stock <= 0 ? (
                        'Out of Stock'
                      ) : (
                        `Add ${quantity} to Cart`
                      )}
                    </Button>
                  </Grid>
                </Grid>

                {/* Status Messages */}
                {addToCartStatus.success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {quantity} of {product?.name || 'Product'} added to cart successfully!
                  </Alert>
                )}

                {addToCartStatus.error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {addToCartStatus.error}
                  </Alert>
                )}

                {product?.stock <= 0 && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    This product is currently out of stock. Please check back later.
                  </Alert>
                )}

                {/* Shipping & Quality Notes */}
                <Box sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalShippingIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Fast Delivery Available
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VerifiedIcon color="action" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Quality Guaranteed
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* Additional Information */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Product Details
            </Typography>
            <Typography variant="body1" paragraph>
              Our {product?.name || 'product'} is sourced from our own farms where the cows are raised in the best conditions.
              We focus on sustainable and ethical farming practices to ensure that our products are of the highest quality.
            </Typography>
            <Typography variant="body1" paragraph>
              This product is ideal for {product?.category === 'Milk' ? 'cafes, restaurants, and food services' : 
                product?.category === 'Cheese' ? 'pizzerias, restaurants, and catering services' : 
                product?.category === 'Yogurt' ? 'hotels, breakfast services, and health food businesses' : 
                product?.category === 'Butter' ? 'bakeries and food manufacturers' : 
                'various food service businesses'}.
            </Typography>
            <Typography variant="body1" paragraph>
              For bulk orders or special requirements, please contact our sales team directly.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bulk Order Inquiry
                </Typography>
                <Typography variant="body2" paragraph>
                  Need larger quantities or custom packaging?
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => navigate('/contact')}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map(relatedProduct => (
                <Grid item key={relatedProduct?.id} xs={12} sm={6} md={3}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                    onClick={() => {
                      navigate(`/products/${relatedProduct?.id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <Box
                      component="img"
                      src={relatedProduct.imageUrl || placeholderImage}
                      alt={relatedProduct.name}
                      sx={{ 
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {relatedProduct.description.substring(0, 60)}...
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        ${Number(relatedProduct?.price || 0).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default ProductDetailPage; 