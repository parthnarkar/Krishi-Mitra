import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar';
import { getCart, updateCartQuantity, removeFromCart } from '../../utils/cartApi';
import { FaArrowLeft, FaTrash, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import './Cart.css';

const API_URL = 'http://localhost:5000/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        // Use MongoDB cart for authenticated users
        const items = await getCart();
        setCartItems(items);
      } else {
        // Redirect to login if not authenticated
        setError('Please log in to view your cart');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again or log in.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      if (isAuthenticated) {
        // Update UI optimistically
        const updatedItems = cartItems.map(item => 
          item.productId._id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
        
        // Update in MongoDB
        await updateCartQuantity(productId, newQuantity);
      } else {
        setError('Please log in to update your cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Failed to update quantity. Please try again.');
      setTimeout(() => setError(''), 3000);
      // Refresh cart to sync with server state
      fetchCartItems();
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      if (isAuthenticated) {
        // Update UI optimistically
        const updatedItems = cartItems.filter(item => item.productId._id !== productId);
        setCartItems(updatedItems);
        
        // Remove from MongoDB
        await removeFromCart(productId);
        
        setSuccess('Item removed from cart');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError('Please log in to update your cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
      setTimeout(() => setError(''), 3000);
      // Refresh cart to sync with server state
      fetchCartItems();
    }
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    
    setIsLoading(true);
    
    // Simulate API call for coupon validation
    setTimeout(() => {
      setDiscountApplied(true);
      setIsLoading(false);
    }, 800);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return discountApplied ? calculateSubtotal() * 0.1 : 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    return subtotal - discountAmount;
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <div className="cart-header">
          <Link to="/products" className="back-to-shopping">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h1>Your Cart ({cartItems.length} items)</h1>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : !isAuthenticated ? (
          <div className="empty-cart">
            <i className="fas fa-user-lock empty-cart-icon"></i>
            <h2>Authentication Required</h2>
            <p>Please log in to view and manage your cart.</p>
            <Link to="/login" className="continue-shopping-btn">Log In</Link>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.productId._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.productId.image} alt={item.productId.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.productId.name}</h3>
                    <p className="item-price">₹{item.productId.price}</p>
                    {item.productId.isOrganic && <span className="organic-badge">Organic</span>}
                  </div>
                  <div className="item-quantity">
                    <button 
                      onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    ₹{item.productId.price * item.quantity}
                  </div>
                  <button 
                    className="remove-item" 
                    onClick={() => handleRemoveItem(item.productId._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal()}</span>
              </div>
              {discountApplied && (
                <div className="summary-row discount">
                  <span>Discount (10%):</span>
                  <span>-₹{calculateDiscount()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{calculateTotal()}</span>
              </div>
              
              <div className="coupon-section">
                <h3>Apply Coupon</h3>
                <div className="coupon-input">
                  <input 
                    type="text" 
                    placeholder="Enter coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={discountApplied || isLoading}
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={!couponCode || discountApplied || isLoading}
                  >
                    {isLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {discountApplied && <div className="success-message">{success}</div>}
                {error && <div className="error-message">{error}</div>}
                <div className="available-coupons">
                  <p>Available Coupons:</p>
                  <ul>
                    <li>KRISHI10 - 10% off on all products</li>
                    <li>ORGANIC20 - 20% off on organic products</li>
                  </ul>
                </div>
              </div>
              
              <div className="checkout-options">
                <h3>Payment Methods</h3>
                <div className="payment-methods">
                  <div className="payment-method">
                    <input type="radio" id="card" name="payment" checked readOnly />
                    <label htmlFor="card">
                      <FaCreditCard /> Credit/Debit Card
                    </label>
                  </div>
                  <div className="payment-method">
                    <input type="radio" id="cash" name="payment" />
                    <label htmlFor="cash">
                      <FaMoneyBill /> Cash on Delivery
                    </label>
                  </div>
                </div>
                
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 