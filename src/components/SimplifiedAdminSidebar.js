import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function SimplifiedAdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard'
    },
    {
      path: '/admin/products',
      name: 'Products'
    },
    {
      path: '/admin/orders',
      name: 'Orders'
    },
    {
      path: '/admin/users',
      name: 'Users'
    },
    {
      path: '/admin/reports',
      name: 'Reports'
    },
    {
      path: '/admin/invoices',
      name: 'Invoices'
    },
    {
      path: '/admin/settings',
      name: 'Settings'
    },
    {
      path: '/admin/help',
      name: 'Help'
    }
  ];

  const currentPath = location.pathname;

  const checkIsActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/admin';
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity md:hidden z-10"
          onClick={() => toggleSidebar()}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-20
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isOpen ? 'w-64' : 'w-0 md:w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center h-16 border-b border-gray-200 ${
            isOpen ? 'px-6' : 'px-2'
          }`}>
            <div className="flex items-center w-full">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              {isOpen && (
                <span className="ml-2 text-lg font-semibold text-gray-800 truncate">Milk Admin</span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center py-2 px-3 rounded-md transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'}
                      ${!isOpen ? 'justify-center md:justify-center' : ''}
                      group
                    `}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-md ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <span className="text-xs font-medium">{item.name[0]}</span>
                    </div>
                    {isOpen && <span className="ml-3 text-sm font-medium truncate">{item.name}</span>}
                    {!isOpen && (
                      <div className="hidden group-hover:block absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-200 ${!isOpen && 'text-center'}`}>
            {isOpen ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <span className="text-sm font-semibold">MM</span>
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-900">MilkMaster</p>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                <span className="text-sm font-semibold">MM</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SimplifiedAdminSidebar; 