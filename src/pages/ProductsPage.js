import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Pagination,
  useMediaQuery,
  useTheme,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TailwindProductCard from '../components/TailwindProductCard';
import config from '../config';

function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get category from URL params if present
  const categoryParam = searchParams.get('category');
  
  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsPerPage = 8;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${config.apiUrl}/api/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Extract unique categories from products
  const categories = ['all', ...new Set(products
    .filter(product => product && product.category) // Filter out null/undefined products and categories
    .map(product => product.category)
  )];

  // Filter and sort products based on search, category, and sort
  useEffect(() => {
    let result = [...products].filter(product => product); // Filter out null/undefined products
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category && category !== 'all') {
      result = result.filter(product => 
        product.category?.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Sort products
    result.sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
    
    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, category, sortBy, products]);

  // Update URL when category changes
  useEffect(() => {
    if (category && category !== 'all') {
      setSearchParams({ category: category.toLowerCase() });
    } else {
      setSearchParams({});
    }
  }, [category, setSearchParams]);

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setSortBy('name');
    setSearchParams({});
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Our Products
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Browse our catalog of premium dairy products for your business
          </Typography>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category-select"
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="price-low">Price (Low to High)</MenuItem>
                  <MenuItem value="price-high">Price (High to Low)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                label="Clear Filters"
                onClick={handleClearFilters}
                color="primary"
                variant="outlined"
                icon={<FilterListIcon />}
                sx={{ height: 40 }}
              />
            </Grid>
          </Grid>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-center flex-wrap">
          <Typography variant="body1" color="text.secondary">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {category !== 'all' && <span> in <strong>{category}</strong></span>}
          </Typography>
          {!isMobile && pageCount > 1 && (
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary" 
              shape="rounded"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse rounded-lg overflow-hidden shadow-md h-full flex flex-col">
                {/* Skeleton image */}
                <div className="bg-gray-300 h-48 w-full"></div>
                
                {/* Skeleton content */}
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header with title and category */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-5 bg-gray-300 rounded-full w-16"></div>
                  </div>
                  
                  {/* Rating skeleton */}
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 bg-gray-300 rounded-full"></div>
                      ))}
                    </div>
                    <div className="h-3 bg-gray-300 rounded ml-2 w-8"></div>
                  </div>
                  
                  {/* Description skeleton */}
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                  </div>
                  
                  {/* Price and stock skeleton */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-300 rounded-full w-20"></div>
                  </div>
                  
                  {/* Button skeleton */}
                  <div className="h-10 bg-gray-300 rounded-md w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <div key={product.id}>
                <TailwindProductCard product={product} />
              </div>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="py-10 text-center">
            <Typography variant="h5" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
          </div>
        )}

        {/* Mobile Pagination - bottom */}
        {isMobile && pageCount > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange}
              color="primary" 
              shape="rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage; 