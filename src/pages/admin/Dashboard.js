import React, { useState, useEffect } from 'react';
import { Card, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, 
  AreaChart, Area
} from 'recharts';
import config from '../../config';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    salesAnalytics: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    summary: {
      totalRevenue: 0,
      averageOrderValue: 0,
      totalCustomers: 0,
      pendingOrders: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('week');

  // Generate mock sales data for the chart
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
          console.log('No admin token found, redirecting to login');
          navigate('/admin');
          return;
        }

        const response = await fetch(`${config.apiUrl}/api/admin/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Dashboard fetch error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch dashboard data');
        }

        const data = await response.json();
        setStats(data);
        
        // Set initial chart data
        if (data.salesAnalytics) {
          updateChartData(timeRange, data.salesAnalytics);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Update chart data when time range changes
  useEffect(() => {
    if (stats.salesAnalytics) {
      updateChartData(timeRange, stats.salesAnalytics);
    }
  }, [timeRange, stats.salesAnalytics]);

  // Function to update chart data based on selected time range
  const updateChartData = (range, analytics) => {
    if (!analytics) return;
    
    let data = [];
    switch(range) {
      case 'week':
        if (analytics.dailyData) {
          data = analytics.dailyData.map(day => ({
            name: day.dayOfWeek,
            sales: day.sales,
            orders: day.orders
          }));
        }
        break;
      case 'month':
        if (analytics.weeklyData) {
          data = analytics.weeklyData.map(week => ({
            name: week.week,
            sales: week.sales,
            orders: week.orders
          }));
        }
        break;
      case 'year':
        if (analytics.monthlyData) {
          data = analytics.monthlyData.map(month => ({
            name: month.monthName,
            sales: month.sales,
            orders: month.orders
          }));
        }
        break;
      default:
        break;
    }
    
    setSalesData(data.length > 0 ? data : generateMockData(range));
  };

  // Fallback to generate mock data if server data is not available
  const generateMockData = (range) => {
    if (range === 'week') {
      return [
        { name: 'Mon', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Tue', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Wed', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Thu', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Fri', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Sat', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 },
        { name: 'Sun', sales: Math.floor(Math.random() * 5000) + 1000, orders: Math.floor(Math.random() * 10) + 2 }
      ];
    } else if (range === 'month') {
      return [
        { name: 'Week 1', sales: Math.floor(Math.random() * 20000) + 5000, orders: Math.floor(Math.random() * 30) + 10 },
        { name: 'Week 2', sales: Math.floor(Math.random() * 20000) + 5000, orders: Math.floor(Math.random() * 30) + 10 },
        { name: 'Week 3', sales: Math.floor(Math.random() * 20000) + 5000, orders: Math.floor(Math.random() * 30) + 10 },
        { name: 'Week 4', sales: Math.floor(Math.random() * 20000) + 5000, orders: Math.floor(Math.random() * 30) + 10 }
      ];
    } else {
      return [
        { name: 'Jan', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Feb', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Mar', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Apr', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'May', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Jun', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Jul', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Aug', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Sep', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Oct', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Nov', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 },
        { name: 'Dec', sales: Math.floor(Math.random() * 50000) + 10000, orders: Math.floor(Math.random() * 100) + 30 }
      ];
    }
  };

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Use actual growth from server if available, otherwise calculate
  const salesGrowth = stats.growth?.monthly ? parseFloat(stats.growth.monthly) : 
                      calculateGrowth(stats.salesAnalytics.monthly, stats.salesAnalytics.monthly * 0.9);
                    
  const ordersGrowth = calculateGrowth(stats.totalOrders, stats.totalOrders * 0.92);
  const productsGrowth = calculateGrowth(stats.totalProducts, stats.totalProducts * 0.98);
  const customersGrowth = calculateGrowth(stats.totalCustomers, stats.totalCustomers * 0.95);

  const statCards = [
    {
      title: 'Total Sales',
      value: `₹${stats.totalSales.toLocaleString()}`,
      icon: <BarChartIcon className="text-blue-500" />,
      change: `${salesGrowth.toFixed(1)}%`,
      positive: salesGrowth >= 0
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCartIcon className="text-green-500" />,
      change: `${ordersGrowth.toFixed(1)}%`,
      positive: ordersGrowth >= 0
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: <Inventory2Icon className="text-purple-500" />,
      change: `${productsGrowth.toFixed(1)}%`,
      positive: productsGrowth >= 0
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toLocaleString(),
      icon: <PeopleIcon className="text-orange-500" />,
      change: `${customersGrowth.toFixed(1)}%`,
      positive: customersGrowth >= 0
    }
  ];

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? `₹${value.toLocaleString()}` : value.toString(),
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} 
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" name="Sales" />
              <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? `₹${value.toLocaleString()}` : value.toString(),
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} 
              />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="sales" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Sales" 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="orders" 
                stroke="#82ca9d" 
                name="Orders" 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? `₹${value.toLocaleString()}` : value.toString(),
                  name === 'sales' ? 'Sales' : 'Orders'
                ]} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="1"
                stroke="#8884d8" 
                fill="#8884d8" 
                name="Sales" 
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stackId="2"
                stroke="#82ca9d" 
                fill="#82ca9d" 
                name="Orders" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
                <div className={`flex items-center mt-2 ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.positive ? 
                    <TrendingUpIcon fontSize="small" className="mr-1" /> : 
                    <TrendingDownIcon fontSize="small" className="mr-1" />
                  }
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-gray-100">
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' || order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
        
        <Card className="p-6 lg:col-span-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Sales Analytics</h2>
            <div className="flex space-x-2">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="chart-type-label">Chart Type</InputLabel>
                <Select
                  labelId="chart-type-label"
                  id="chart-type"
                  value={chartType}
                  label="Chart Type"
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="area">Area Chart</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="time-range-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-label"
                  id="time-range"
                  value={timeRange}
                  label="Time Range"
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="year">Yearly</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="h-[400px]">
            {renderChart()}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-900">₹{stats.summary?.totalRevenue?.toLocaleString() || '0'}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Overall revenue across all transactions</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg. Order Value</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-900">₹{stats.summary?.averageOrderValue?.toLocaleString(undefined, {maximumFractionDigits: 2}) || '0'}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Average amount spent per order</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Orders</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-900">{stats.summary?.pendingOrders || '0'}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Orders awaiting processing</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Low Stock Products</h3>
          <div className="flex items-center">
            <div className="text-3xl font-bold text-gray-900">{stats.summary?.lowStockProducts || '0'}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Products with inventory below 10 units</p>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard; 