import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const navigate = useNavigate();

    // Get admin info from localStorage
    const adminToken = localStorage.getItem('adminToken');
    const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
    const adminId = adminData.id;

    // Check token expiration
    useEffect(() => {
        const checkTokenExpiration = () => {
            if (!adminToken) {
                navigate('/admin');
                return;
            }

            try {
                // Decode the token to check expiration
                const tokenData = JSON.parse(atob(adminToken.split('.')[1]));
                const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();

                if (currentTime >= expirationTime) {
                    // Token has expired
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                    localStorage.removeItem('isAdminLoggedIn');
                    navigate('/admin');
                    return;
                }

                // Set up automatic logout when token expires
                const timeUntilExpiration = expirationTime - currentTime;
                const logoutTimer = setTimeout(() => {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('admin');
                    localStorage.removeItem('isAdminLoggedIn');
                    navigate('/admin');
                }, timeUntilExpiration);

                return () => clearTimeout(logoutTimer);
            } catch (error) {
                console.error('Error checking token expiration:', error);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('admin');
                localStorage.removeItem('isAdminLoggedIn');
                navigate('/admin');
            }
        };

        checkTokenExpiration();
    }, [navigate, adminToken]);

    // If no admin token, don't render children
    if (!adminToken) {
        return null;
    }

    // Render children if admin is authenticated
    return children;
};

export default AdminRoute;