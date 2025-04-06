import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaClock } from 'react-icons/fa';

const OrderCard = ({ order }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status icon based on delivery status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  // Get status color based on delivery status
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.deliveryStatus)}`}>
          <span className="flex items-center">
            {getStatusIcon(order.deliveryStatus)}
            <span className="ml-1 capitalize">{order.deliveryStatus}</span>
          </span>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total:</span> ₹{order.totalAmount.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Items:</span> {order.products.length}
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <Link 
          to={`/orders/${order._id}`} 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          order.paymentStatus === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : order.paymentStatus === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
        }`}>
          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 