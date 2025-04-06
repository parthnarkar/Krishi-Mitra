import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaCog, FaBox } from 'react-icons/fa';
import { getCurrentUser } from '../utils/authApi';
import { getUserOrders } from '../utils/orderApi';
import DashboardCard from '../components/dashboard/DashboardCard';
import OrderCard from '../components/dashboard/OrderCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const userData = await getCurrentUser();
        setUser(userData);

        // Fetch orders
        const ordersData = await getUserOrders();
        setOrders(ordersData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        if (err.message === 'No token found') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Profile"
            description="Manage your personal information and preferences"
            icon={<FaUser className="h-6 w-6" />}
            buttonText="Edit Profile"
            buttonLink="/profile"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            textColor="text-blue-700"
            buttonColor="bg-blue-600 hover:bg-blue-700"
          />
          <DashboardCard
            title="Orders"
            description="View and track your order history"
            icon={<FaShoppingBag className="h-6 w-6" />}
            buttonText="View Orders"
            buttonLink="/orders"
            bgColor="bg-green-50"
            borderColor="border-green-200"
            textColor="text-green-700"
            buttonColor="bg-green-600 hover:bg-green-700"
          />
          <DashboardCard
            title="Settings"
            description="Configure your account settings"
            icon={<FaCog className="h-6 w-6" />}
            buttonText="Manage Settings"
            buttonLink="/settings"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
            textColor="text-purple-700"
            buttonColor="bg-purple-600 hover:bg-purple-700"
          />
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <FaBox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 