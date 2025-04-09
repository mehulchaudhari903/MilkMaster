import React from 'react';
import { Link } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const AdminDashboard = () => {
  // Sample data - replace with real data from your backend
  const stats = [
    {
      name: 'Total Revenue',
      value: '₹92,847',
      change: '+20.1%',
      changeType: 'positive',
      icon: AttachMoneyIcon,
    },
    {
      name: 'Active Orders',
      value: '147',
      change: '+15%',
      changeType: 'positive',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Customers',
      value: '573',
      change: '+12.5%',
      changeType: 'positive',
      icon: PeopleIcon,
    },
    {
      name: 'Growth Rate',
      value: '24.5%',
      change: '+4.75%',
      changeType: 'positive',
      icon: TrendingUpIcon,
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-2024-001',
      customer: 'Sunrise Dairy Farm',
      product: 'Full Cream Milk',
      amount: '₹12,450',
      status: 'Processing',
    },
    {
      id: 'ORD-2024-002',
      customer: 'Green Valley Distributors',
      product: 'Toned Milk',
      amount: '₹8,275',
      status: 'Delivered',
    },
    {
      id: 'ORD-2024-003',
      customer: 'City Fresh Foods',
      product: 'Butter',
      amount: '₹15,840',
      status: 'Pending',
    },
    {
      id: 'ORD-2024-004',
      customer: 'Royal Cafe Chain',
      product: 'Paneer',
      amount: '₹9,620',
      status: 'Processing',
    },
  ];

  const lowStockItems = [
    {
      product: 'Full Cream Milk',
      stock: '50 liters',
      threshold: '100 liters',
      status: 'Critical',
    },
    {
      product: 'Butter',
      stock: '75 kg',
      threshold: '100 kg',
      status: 'Warning',
    },
    {
      product: 'Cheese',
      stock: '45 kg',
      threshold: '60 kg',
      status: 'Warning',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your dairy business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon sx={{ fontSize: 24, color: 'text.secondary' }} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <Link
                  to="/admin/orders"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
                >
                  View all
                  <ChevronRightIcon sx={{ fontSize: 16, marginLeft: '4px' }} />
                </Link>
              </div>
              <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Customer
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {order.id}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.customer}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.product}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.amount}
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Low Stock Alerts</h2>
                <Link
                  to="/admin/inventory"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 flex items-center"
                >
                  View inventory
                  <ChevronRightIcon sx={{ fontSize: 16, marginLeft: '4px' }} />
                </Link>
              </div>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg
                      ${item.status === 'Critical' ? 'bg-red-50' : 'bg-yellow-50'}`}
                  >
                    <div className="flex items-center">
                      <WarningIcon 
                        sx={{ 
                          fontSize: 20,
                          marginRight: '12px',
                          color: item.status === 'Critical' ? '#f87171' : '#fbbf24'
                        }} 
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.product}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {item.stock} / Threshold: {item.threshold}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${item.status === 'Critical' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 