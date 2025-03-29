import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderIdInput, setOrderIdInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    upiId: ''
  });

  // Fetch order data when component mounts or when orderId changes
  useEffect(() => {
    const orderId = new URLSearchParams(location.search).get('orderId');
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [location.search]);

  const fetchOrder = async (orderId) => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching order with ID:', orderId);
      const response = await axios.get(`/orders/${orderId}`);
      console.log('Order data received:', response.data);
      
      if (!response.data) {
        throw new Error('No order data received');
      }

      setOrder(response.data);
      
      // Pre-fill address if available
      if (response.data.deliveryAddress) {
        setFormData(prev => ({
          ...prev,
          addressLine1: response.data.deliveryAddress.addressLine1 || '',
          addressLine2: response.data.deliveryAddress.addressLine2 || '',
          city: response.data.deliveryAddress.city || '',
          state: response.data.deliveryAddress.state || '',
          pincode: response.data.deliveryAddress.pincode || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch order details';
      setError(`Error: ${errorMessage}. Please check your order ID and try again.`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderIdSubmit = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    // For testing purposes, let's create a mock order if the API is not ready
    if (orderIdInput.toLowerCase() === 'test') {
      const mockOrder = {
        _id: 'test123',
        products: [
          {
            product: {
              _id: 'p1',
              name: 'Test Product 1'
            },
            quantity: 2,
            subtotal: 1000
          }
        ],
        totalAmount: 1000,
        deliveryAddress: {
          addressLine1: '',
          city: '',
          state: '',
          pincode: ''
        }
      };
      setOrder(mockOrder);
      return;
    }

    // Update URL with order ID
    navigate(`/payment?orderId=${orderIdInput.trim()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.pincode) {
      throw new Error('Please fill in all required fields');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      throw new Error('Please enter a valid 10-digit phone number');
    }

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv) {
        throw new Error('Please fill in all card details');
      }
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        throw new Error('Please enter a valid 16-digit card number');
      }
      if (!/^\d{3}$/.test(formData.cardCvv)) {
        throw new Error('Please enter a valid 3-digit CVV');
      }
    }

    if (formData.paymentMethod === 'upi') {
      if (!formData.upiId) {
        throw new Error('Please enter your UPI ID');
      }
      if (!/^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/.test(formData.upiId)) {
        throw new Error('Please enter a valid UPI ID');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();

      // Update order with payment and shipping details
      const response = await axios.put(`/orders/${order._id}`, {
        deliveryAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'Paid',
        status: 'Confirmed'
      });

      // Navigate to confirmation page with order details
      navigate('/order-confirmation', { 
        state: { 
          order: response.data
        }
      });
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  // Show order ID input form if no order is loaded
  if (!order) {
    return (
      <div className="payment-page">
        <div className="order-id-container">
          <h2>Enter Order ID</h2>
          <form onSubmit={handleOrderIdSubmit} className="order-id-form">
            <div className="form-group">
              <label htmlFor="orderId">Order ID *</label>
              <input
                type="text"
                id="orderId"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                placeholder="Enter your order ID"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {order.products.map((item) => (
              <div key={item.product._id} className="cart-item">
                <div className="item-details">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{item.subtotal}</span>
              </div>
            ))}
          </div>
          <div className="total-amount">
            <span>Total Amount:</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <h3>Shipping Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressLine1">Address Line 1 *</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressLine2">Address Line 2</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleInputChange}
                />
                <label htmlFor="card">
                  <span className="payment-icon">💳</span>
                  Credit/Debit Card
                </label>
              </div>
              <div className="payment-method">
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={handleInputChange}
                />
                <label htmlFor="upi">
                  <span className="payment-icon">📱</span>
                  UPI Payment
                </label>
              </div>
              <div className="payment-method">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleInputChange}
                />
                <label htmlFor="cod">
                  <span className="payment-icon">💵</span>
                  Cash on Delivery
                </label>
              </div>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpiry">Expiry Date *</label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV *</label>
                    <input
                      type="password"
                      id="cardCvv"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'upi' && (
              <div className="upi-details">
                <div className="form-group">
                  <label htmlFor="upiId">UPI ID *</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="yourname@upi"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ₹${order.totalAmount}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage; 