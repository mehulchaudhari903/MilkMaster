import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import config from '../config';

// Default placeholder image for products without images
const placeholderImage = 'https://via.placeholder.com/300x200?text=Dairy+Product';

function TailwindProductCard({ product }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  
  // Destructure product properties with fallbacks for safety
  const { 
    id, 
    name, 
    description, 
    price, 
    category, 
    stock,
    imageUrl = placeholderImage,
    status
  } = product;
  
  // Effect to handle image loading
  useEffect(() => {
    const img = new Image();
    img.src = 'http://localhost:5000' + imageUrl;
    img.onload = () => setIsLoading(false);
    img.onerror = () => {
      setImageError(true);
      setIsLoading(false);
    };
  }, [imageUrl]);

  const handleClick = () => {
    navigate(`/products/${id}`);
  };

  // Determine stock status styling
  const getStockStatus = () => {
    // Use status from backend if available, otherwise determine from stock
    if (status) {
      switch (status) {
        case 'In Stock':
          return { 
            text: 'In Stock', 
            className: 'bg-green-100 text-green-800',
            icon: '✓'
          };
        case 'Low Stock':
          return { 
            text: 'Low Stock', 
            className: 'bg-yellow-100 text-yellow-800',
            icon: '!'
          };
        case 'Out of Stock':
          return { 
            text: 'Out of Stock', 
            className: 'bg-red-100 text-red-800',
            icon: '×'
          };
        default:
          return determineStatusFromStock(stock);
      }
    }
    return determineStatusFromStock(stock);
  };

  const determineStatusFromStock = (stockValue) => {
    const stock = Number(stockValue);
    if (stock <= 0) return { 
      text: 'Out of Stock', 
      className: 'bg-red-100 text-red-800',
      icon: '×'
    };
    if (stock <= 10) return { 
      text: 'Low Stock', 
      className: 'bg-yellow-100 text-yellow-800',
      icon: '!'
    };
    return { 
      text: 'In Stock', 
      className: 'bg-green-100 text-green-800',
      icon: '✓'
    };
  };

  const stockStatus = getStockStatus();

  // Add to Cart functionality
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation to product detail
    
    // Check if product is out of stock
    if (stock <= 0) {
      setError('This product is out of stock');
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to login page
      navigate('/login', { 
        state: { 
          from: `/products/${id}`,
          message: 'Please login to add items to cart'
        }
      });
      return;
    }

    try {
      // Get user ID from localStorage
      let userId = null;
      try {
        // First try to get user info from 'user' object
        const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
        userId = userInfo.id;
        
        // If not found, try to decode from token
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

      // Check if adding this item would exceed available stock
      const cartItem = {
        ...product,
        quantity: 1,
        userId: userId,
        totalQuantity: '1 unit',
        remainingStock: stock - 1
      };
      
      // Add to cart using context
      const result = await addToCart(cartItem);
      
      if (result.success) {
        // Show success toast notification
        setShowToast(true);
        setError('');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } else {
        // Show error message with stock information
        if (result.message.includes('stock')) {
          setError(`Only ${stock} available in stock`);
        } else {
          setError(result.message);
        }
        setShowToast(false);
        
        // Hide error after 3 seconds
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart');
      setShowToast(false);
      
      // Hide error after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  // Add error state
  const [error, setError] = useState('');

  return (
    <div 
      className="card group h-full flex flex-col transform transition-all duration-300 hover:-translate-y-2 relative"
      role="article"
      aria-label={`Product card for ${name}`}
    >
      {/* Error Message */}
      {error && (
        <div 
          className="absolute right-0 top-0 mt-2 mr-2 z-50 bg-red-500 text-white text-sm rounded-lg py-2 px-4 shadow-lg transform transition-all duration-500"
          role="alert"
        >
          {error}
        </div>
      )}
      
      {/* Toast Notification */}
      {showToast && (
        <div 
          className="absolute right-0 top-0 mt-2 mr-2 z-50 bg-green-500 text-white text-sm rounded-lg py-2 px-4 shadow-lg transform transition-all duration-500 animate-bounce"
          role="alert"
        >
          Added to cart!
        </div>
      )}
      
      <div className="relative overflow-hidden">
        {/* Category Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {category}
          </span>
        </div>
        
        {/* Stock Badge */}
        {stock <= 10 && stock > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Only {stock} left
            </span>
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-100">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <img 
              src={imageError ? placeholderImage : imageUrl ? `${config.apiUrl}${imageUrl}` : placeholderImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={handleClick}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = placeholderImage;
                setImageError(true);
              }}
            />
          )}
        </div>
      </div>
      
      {/* Product Content */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="mb-2 cursor-pointer" onClick={handleClick}>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
        </div>
        
        {/* Stock Status */}
        <div className="flex items-center mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            stock <= 0 
              ? 'bg-red-100 text-red-800'
              : stock <= 10
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            <span className="mr-1">
              {stock <= 0 ? '×' : stock <= 10 ? '!' : '✓'}
            </span>
            {stock <= 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock'}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        
        {/* Price */}
        <div className="flex justify-between items-center mt-auto">
          <div>
            <span className="text-lg font-bold text-primary-600">₹{price}</span>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className={`w-full mt-2 py-2 flex items-center justify-center rounded-md transition-colors duration-300 ${
            stock <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          }`}
          disabled={stock <= 0}
          onClick={handleAddToCart}
          aria-label={`Add ${name} to cart`}
          aria-disabled={stock <= 0}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          {stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default TailwindProductCard; 