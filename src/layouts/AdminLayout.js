import React, { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import { Outlet } from 'react-router-dom';

function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on mobile when screen size changes
  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          isSidebarOpen && !isMobile ? '' : isMobile ? 'ml-0' : 'ml-0'
        }`}
      >
        <AdminNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container  px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout; 