import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
const logoImagePath = '/assets/image/logo.png';
const pages = [
  { title: 'Home', path: '/' },
  { title: 'Products', path: '/products' },
  { title: 'About Us', path: '/about' },
  { title: 'Contact', path: '/contact' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleCart, getCartCount, addToCart } = useCart();
  
  useEffect(() => {
    // Check login status and user data on component mount and route changes
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, [location]);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  
  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
    
    // Redirect to home page if on protected routes
    if (location.pathname.startsWith('/profile') || location.pathname.startsWith('/orders')) {
      navigate('/');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoImagePath} 
                  alt="Logo" 
                  className="h-8 w-auto sm:h-9 md:h-10 mr-2 object-contain"
                />
              </Link>
            </div>
            
            {/* Desktop navigation - hidden on mobile */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {pages.map((page) => (
                <Link
                  key={page.title} 
                  to={page.path}
                  className={`${
                    location.pathname === page.path
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {page.title}
                </Link>
              ))}
              
              {/* Protected routes for logged-in users */}
              {isLoggedIn && (
                <>
                  <Link
                    to="/profile"
                    className={`${
                      location.pathname === '/profile'
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className={`${
                      location.pathname === '/orders'
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    Orders
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button and cart */}
          <div className="flex items-center">
            {/* User menu for desktop */}
            {isLoggedIn ? (
              <div className="hidden sm:flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  Welcome, {user?.name || 'User'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Add to cart button (desktop)
            <button
              className="hidden sm:flex items-center mr-4 px-4 py-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition duration-150"
              onClick={handleAddToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Cart
            </button> */}
            
            {/* Cart button */}

            {
              isLoggedIn && (
                <>
                            <button 
              className="bg-primary-500 text-white p-2 rounded-md ml-4 flex items-center relative"
              onClick={toggleCart}
              aria-label="View shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span className="hidden sm:inline ml-2">Cart</span>
              
              {/* Cart count badge */}
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
                </>
              )

            }
            
            {/* Mobile menu button */}
            <div className="sm:hidden ml-4">
              <button 
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {pages.map((page) => (
            <Link
              key={page.title}
              to={page.path}
              className={`${
                location.pathname === page.path
                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              {page.title}
            </Link>
          ))}
          
          {/* Protected routes in mobile menu */}
          {isLoggedIn && (
            <>
              <Link
                to="/profile"
                className={`${
                  location.pathname === '/profile'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/orders"
                className={`${
                  location.pathname === '/orders'
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>
              <button
                className="w-full text-left border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
          
          {/* Auth links in mobile menu for non-logged in users */}
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
          
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 