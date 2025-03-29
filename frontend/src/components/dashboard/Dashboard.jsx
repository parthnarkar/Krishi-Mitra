import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWarehouse, FaHandshake, FaShoppingCart, FaBox, FaTruck } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeNegotiations: 0,
    storageBookings: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    setUserStats({
      totalOrders: 12,
      pendingOrders: 3,
      activeNegotiations: 2,
      storageBookings: 1
    });
  }, []);

  const featureCards = [
    {
      title: 'Cold Storage',
      description: 'Book cold storage facilities for your produce',
      icon: <FaWarehouse className="w-8 h-8" />,
      color: 'bg-blue-500',
      path: '/cold-storage',
      stats: {
        label: 'Active Bookings',
        value: userStats.storageBookings
      }
    },
    {
      title: 'Bulk Buy',
      description: 'Negotiate prices for bulk purchases',
      icon: <FaHandshake className="w-8 h-8" />,
      color: 'bg-green-500',
      path: '/bulk-buy',
      stats: {
        label: 'Active Negotiations',
        value: userStats.activeNegotiations
      }
    },
    {
      title: 'Orders',
      description: 'View and manage your orders',
      icon: <FaShoppingCart className="w-8 h-8" />,
      color: 'bg-purple-500',
      path: '/orders',
      stats: {
        label: 'Pending Orders',
        value: userStats.pendingOrders
      }
    },
    {
      title: 'Products',
      description: 'Manage your product listings',
      icon: <FaBox className="w-8 h-8" />,
      color: 'bg-orange-500',
      path: '/products',
      stats: {
        label: 'Total Products',
        value: 8
      }
    }
  ];

  const recentActivities = [
    {
      type: 'storage',
      title: 'Cold Storage Booking',
      description: 'Booked 500 tons at FrostFresh Storage',
      date: '2024-03-28',
      status: 'active'
    },
    {
      type: 'negotiation',
      title: 'Bulk Buy Negotiation',
      description: 'Negotiating 1000 units of Premium Product',
      date: '2024-03-27',
      status: 'pending'
    },
    {
      type: 'order',
      title: 'New Order',
      description: 'Order #1234 received',
      date: '2024-03-26',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, Farmer!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your farm today</p>
        </div>

        {/* Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(card.path)}
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{card.stats.label}</span>
                <span className="text-lg font-bold text-gray-900">{card.stats.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'storage' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'negotiation' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'storage' ? <FaWarehouse /> :
                     activity.type === 'negotiation' ? <FaHandshake /> :
                     <FaShoppingCart />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.date}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    activity.status === 'active' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/cold-storage')}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FaWarehouse />
                <span>Book Cold Storage</span>
              </button>
              <button
                onClick={() => navigate('/bulk-buy')}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FaHandshake />
                <span>Start Bulk Negotiation</span>
              </button>
              <button
                onClick={() => navigate('/products/new')}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FaBox />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaTruck className="text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Order #1234</p>
                    <p className="text-sm text-gray-600">In Transit</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 days left</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FaWarehouse className="text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Storage Booking</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">15 days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 