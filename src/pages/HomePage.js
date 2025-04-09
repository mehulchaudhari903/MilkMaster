import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import Hero from '../components/Hero';
import { useCart } from '../context/CartContext';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DiscountIcon from '@mui/icons-material/Discount';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TailwindProductCard from '../components/TailwindProductCard';
import config from '../config';

function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, totalB2bClients: 0 });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/homepage/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      // Filter out products that are out of stock
      const inStockProducts = data.filter(product => product.stock > 0);
      
      // Get random 4 products from in-stock products
      const shuffled = inStockProducts.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 4));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Categories with images
  const categories = [
    {
      name: 'Milk',
      image: '/assets/image/milk.jfif',
      description: 'Premium quality milk varieties for cafes, restaurants, and food services.'
    },
    {
      name: 'Cheese',
      image: '/assets/image/cheese.jfif',
      description: 'Artisanal and bulk cheese options for restaurants and food manufacturers.'
    },
    {
      name: 'Yogurt',
      image: '/assets/image/yogurt.jfif',
      description: 'Creamy yogurt products for hotels, breakfast services, and health food businesses.'
    },
    {
      name: 'Butter & Cream',
      image: '/assets/image/butter&cream.jpeg',
      description: 'High-quality butter and cream for bakeries, patisseries, and food production.'
    }
  ];

  // Service benefits
  const benefits = [
    {
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
      title: 'Fast Delivery',
      description: 'Next-day delivery for all orders placed before 2 PM. Temperature-controlled vehicles to ensure product freshness.'
    },
    {
      icon: <VerifiedIcon fontSize="large" color="primary" />,
      title: 'Quality Guaranteed',
      description: 'All products sourced from our own farms and trusted partners. Rigorous quality control at every step.'
    },
    {
      icon: <SupportAgentIcon fontSize="large" color="primary" />,
      title: 'Dedicated Support',
      description: 'Personal account manager for all B2B clients. 24/7 customer service for urgent requirements.'
    },
    {
      icon: <DiscountIcon fontSize="large" color="primary" />,
      title: 'Wholesale Pricing',
      description: 'Competitive bulk pricing and volume discounts. Flexible payment terms for regular clients.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Hero stats={stats} />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Our most popular dairy products for business customers
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="card h-full flex flex-col animate-pulse">
                  {/* Skeleton Image */}
                  <div className="relative h-48 w-full bg-gray-300 rounded-t-lg overflow-hidden"></div>
                  
                  {/* Skeleton Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    {/* Skeleton Title */}
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                    
                    {/* Skeleton Rating */}
                    <div className="flex items-center mb-4">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    
                    {/* Skeleton Description */}
                    <div className="space-y-2 mb-4">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                    </div>
                    
                    {/* Skeleton Price and Stock */}
                    <div className="flex justify-between items-center mt-auto mb-4">
                      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-5 bg-gray-300 rounded w-1/4"></div>
                    </div>
                    
                    {/* Skeleton Button */}
                    <div className="h-10 bg-gray-300 rounded-md w-full mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {featuredProducts.map(product => (
                <div key={product.id}>
                  <TailwindProductCard product={product} />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <button onClick={() => navigate('/products')} className="btn-outline">
              View All Products
            </button>
          </div>
        </div>
      </section>

      <Divider />

      {/* Categories Section */}
      <Box sx={{ bgcolor: '#f8f9fa', py: { xs: 5, md: 8 } }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
              Product Categories
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              Explore our wide range of dairy products
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item key={category.name} xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={category.image}
                    alt={category.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">
              We provide the best service for our B2B customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">All products sourced from our own farms and trusted partners. Rigorous quality control at every step.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Next-day delivery for all orders placed before 2 PM. Temperature-controlled vehicles to ensure product freshness.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600">Personal account manager for all B2B clients. 24/7 customer service for urgent requirements.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wholesale Pricing</h3>
              <p className="text-gray-600">Competitive bulk pricing and volume discounts. Flexible payment terms for regular clients.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to Order?
              </h2>
              <p className="mt-3 max-w-3xl text-lg opacity-90">
                Contact our sales team for personalized quotes and business accounts.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link to="/contact" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {addedProduct} added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomePage; 