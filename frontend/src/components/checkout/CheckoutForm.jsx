import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const CheckoutForm = ({ formData, handleInputChange, errors }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-green-700 text-white p-4 flex items-center">
        <FaUser className="mr-2" />
        <h2 className="text-xl font-semibold">Shipping Information</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your full name"
                required
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your phone number"
                required
              />
            </div>
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                placeholder="Enter your complete delivery address"
                required
              />
            </div>
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm; 