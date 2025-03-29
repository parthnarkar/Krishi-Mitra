import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../App.css';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const { order } = location.state || { 
    order: {
      orderId: 'DEMO12345',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      totalAmount: 2497,
      items: [
        { id: 1, name: 'Organic Fertilizer', price: 999, quantity: 2 },
        { id: 2, name: 'Premium Seeds Pack', price: 499, quantity: 1 }
      ],
      shippingAddress: {
        name: 'Demo User',
        address: '123 Farm Road',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        phone: '1234567890',
        email: 'demo@example.com'
      },
      paymentMethod: 'Card',
      createdAt: new Date().toISOString()
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getEstimatedDelivery = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return formatDate(deliveryDate);
  };

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-header">
        <div className="success-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase</p>
      </div>

      <div className="order-details">
        <div className="order-info">
          <h3>Order Information</h3>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Order Date:</strong> {formatDate(order.createdAt)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> <span className="payment-status">{order.paymentStatus}</span></p>
          <p><strong>Estimated Delivery:</strong> {getEstimatedDelivery()}</p>
        </div>

        <div className="shipping-info">
          <h3>Shipping Address</h3>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
          <p>Phone: {order.shippingAddress.phone}</p>
          <p>Email: {order.shippingAddress.email}</p>
        </div>
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="order-items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">x {item.quantity}</span>
              </div>
              <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="order-total">
          <strong>Total Amount:</strong>
          <strong>₹{order.totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/marketplace" className="btn btn-secondary">Continue Shopping</Link>
        <Link to="/orders" className="btn btn-primary">View All Orders</Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 