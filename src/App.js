import React from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { CartProvider } from './context/CartContext';
import { useEffect } from 'react';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Contact from './pages/admin/Contact';
import Settings from './pages/admin/Settings';

// Main pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import Checkout from './pages/Checkout'; 
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminLogin from './pages/AdminLogin';
import Error404 from './Error/Error404';
import Profile from './pages/Profile';
import FAQsPage from './pages/FAQsPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';

// Components and Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ShoppingCart from './components/ShoppingCart';
import UserOrders from './pages/Orders';

// Main Layout Component
const MainLayout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        // Don't navigate to login if on public routes
        const publicRoutes = ['/', '/products', '/products/', '/contact', '/faqs', '/returns'];
        if (!publicRoutes.some(route => window.location.pathname.startsWith(route))) {
          navigate('/login');
        }
        return;
      }

      try {
        // Decode the token to check expiration
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (currentTime >= expirationTime) {
          // Token has expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          navigate('/login');
          return;
        }

        // Set up automatic logout when token expires
        const timeUntilExpiration = expirationTime - currentTime;
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
          navigate('/login');
        }, timeUntilExpiration);

        return () => clearTimeout(logoutTimer);
      } catch (error) {
        console.error('Error checking token expiration:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
      }
    };

    checkTokenExpiration();
  }, [navigate, token]);

  // Only check token for protected routes
  const isProtectedRoute = () => {
    const protectedRoutes = ['/profile', '/orders', '/checkout'];
    return protectedRoutes.some(route => window.location.pathname.startsWith(route));
  };

  // If no token and trying to access protected route, don't render
  if (!token && isProtectedRoute()) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      {/* <TempCart /> */}
    </Box>
  );
};

function App() {
  return (
    <CartProvider>
      <ShoppingCart />
          <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="faqs" element={<FAQsPage />} />
          <Route path="returns" element={<ReturnPolicyPage />} />
        </Route>
        <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
         
        </Route>

        <Route path="/admin" element={<AdminLogin />} />
            
            {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
          <Route path="products" element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          } />
          <Route path="orders" element={
            <AdminRoute>
              <Orders />
            </AdminRoute>
          } />
          <Route path="users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />
          <Route path="contact" element={
            <AdminRoute>
              <Contact />
            </AdminRoute>
          } />
          <Route path="settings" element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          } />
         
        </Route>

        {/* Redirect unmatched routes to home */}
        <Route path="*" element={<Error404/>} />
          </Routes>
    </CartProvider>
  );
}

export default App; 