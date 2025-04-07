import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaTruck, FaEnvelope, FaLeaf } from 'react-icons/fa';
import { GiWheat } from 'react-icons/gi';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderNumber, orderDetails } = location.state || {};

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="text-center p-8 border-b border-gray-200">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <FaCheckCircle className="text-6xl text-green-500" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Supporting Local Farmers!</h1>
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <GiWheat className="text-green-600" />
              Your order has been placed successfully
            </p>
            <div className="mt-4 text-green-700 font-semibold">
              Order Number: {orderNumber}
            </div>
            <div className="text-sm text-gray-500">
              Placed on: {formatDate(orderDetails.createdAt)}
            </div>
          </div>

          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Name:</span> {orderDetails.customerInfo.name}</p>
                  <p><span className="text-gray-600">Email:</span> {orderDetails.customerInfo.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {orderDetails.customerInfo.phone}</p>
                  <p><span className="text-gray-600">Address:</span> {orderDetails.customerInfo.address}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Status</h3>
              <div className="relative">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((status, index) => (
                    <div key={status} className={`flex flex-col items-center ${index === 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        <FaLeaf className={index === 0 ? 'text-white' : 'text-gray-400'} />
                      </div>
                      <span className="mt-2 text-sm font-medium">{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <FaEnvelope className="mx-auto text-2xl text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">You'll receive an email confirmation shortly</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <FaShoppingBag className="mx-auto text-2xl text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Our farmers will prepare your fresh produce</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <FaTruck className="mx-auto text-2xl text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Your order will be delivered within 2-3 days</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <FaShoppingBag className="mr-2" />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <FaTruck className="mr-2" />
                Track Order
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 