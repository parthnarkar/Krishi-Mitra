import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { getLocalCart, updateLocalCartQuantity, removeFromLocalCart } from '../utils/cartUtils';

const API_URL = 'http://localhost:5000/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Get cart from localStorage first
      const localCart = getLocalCart();
      
      if (token) {
        // If authenticated, try to fetch from API
        try {
          const response = await axios.get(`${API_URL}/users/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCartItems(response.data);
        } catch (error) {
          console.error('Error fetching cart from API:', error);
          // Fallback to localStorage
          setCartItems(localCart);
        }
      } else {
        // Not authenticated, use localStorage
        setCartItems(localCart);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load your cart. Please try again.');
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return removeFromCart(productId);
      }

      // Update local state first for immediate feedback
      const updatedItems = cartItems.map(item => {
        const itemId = item.productId._id || item.productId;
        return (itemId === productId) ? { ...item, quantity: newQuantity } : item;
      });
      
      setCartItems(updatedItems);

      // Update in local storage
      updateLocalCartQuantity(productId, newQuantity);

      // Update on server if authenticated
      if (token) {
        await axios.post(
          `${API_URL}/users/cart`,
          { productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
      // Refresh cart to sync with stored state
      fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Update local state first
      const updatedItems = cartItems.filter(item => {
        const itemId = item.productId._id || item.productId;
        return itemId !== productId;
      });
      
      setCartItems(updatedItems);

      // Update in local storage
      removeFromLocalCart(productId);

      // Update on server if authenticated
      if (token) {
        await axios.delete(`${API_URL}/users/cart/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
      // Refresh cart to sync with stored state
      fetchCart();
    }
  };

  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === 'KRISHI10') {
      setDiscountApplied(true);
      setDiscountAmount(calculateSubtotal() * 0.1); // 10% discount
    } else if (couponCode.toUpperCase() === 'CONNECT20') {
      setDiscountApplied(true);
      setDiscountAmount(calculateSubtotal() * 0.2); // 20% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId;
      if (!product) return total;
      
      const price = typeof product === 'object' 
        ? (product.discountPrice || product.price)
        : 0;
        
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingFee = subtotal > 500 ? 0 : 40; // Free shipping over ₹500
    return subtotal + shippingFee - discountAmount;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Link to="/" className="text-green-600 hover:text-green-700">
            Continue Shopping
          </Link>
        </div>

        {error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y">
                  {cartItems.map((item, index) => {
                    const product = item.productId;
                    // Skip rendering if product is invalid
                    if (!product) return null;
                    
                    const productId = typeof product === 'object' ? product._id : product;
                    const productName = typeof product === 'object' ? product.name : 'Product';
                    const productImage = typeof product === 'object' ? product.image : 'https://via.placeholder.com/100';
                    const productCategory = typeof product === 'object' ? product.category : '';
                    const productPrice = typeof product === 'object' ? product.price : 0;
                    const productDiscountPrice = typeof product === 'object' ? product.discountPrice : null;
                    
                    return (
                      <div key={productId || index} className="p-4">
                        <div className="flex items-center">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="ml-4 flex-grow">
                            <Link
                              to={`/product/${productId}`}
                              className="font-medium hover:text-green-600"
                            >
                              {productName}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {productCategory}
                            </div>
                            <div className="mt-1">
                              {productDiscountPrice ? (
                                <>
                                  <span className="font-bold">
                                    ₹{productDiscountPrice}
                                  </span>
                                  <span className="text-gray-500 line-through ml-2">
                                    ₹{productPrice}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold">
                                  ₹{productPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex border border-gray-300 rounded-md">
                              <button
                                onClick={() => updateQuantity(productId, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 border-l border-r border-gray-300">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(productId, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{calculateSubtotal() > 500 ? 'Free' : '₹40.00'}</span>
                  </div>
                  
                  {discountApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Including GST
                    </div>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply Coupon Code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r hover:bg-gray-300"
                      onClick={handleCouponApply}
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Try "KRISHI10" for 10% off or "CONNECT20" for 20% off</p>
                </div>

                <button 
                  className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure checkout
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Multiple payment options
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Free delivery above ₹500
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 