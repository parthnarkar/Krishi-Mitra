import React, { useState } from 'react';
import { FaShoppingBag, FaTruck, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const [orders] = useState([
    {
      id: 1,
      date: '2024-03-15',
      total: 1500,
      status: 'Delivered',
      items: [
        {
          name: 'Fresh Tomatoes',
          quantity: 2,
          price: 300
        },
        {
          name: 'Organic Rice',
          quantity: 1,
          price: 900
        }
      ],
      shippingAddress: '123 Farm Street, Rural Area, Country',
      paymentMethod: 'UPI',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 2,
      date: '2024-03-10',
      total: 800,
      status: 'Processing',
      items: [
        {
          name: 'Organic Wheat',
          quantity: 1,
          price: 500
        },
        {
          name: 'Fresh Vegetables',
          quantity: 1,
          price: 300
        }
      ],
      shippingAddress: '123 Farm Street, Rural Area, Country',
      paymentMethod: 'Card',
      trackingNumber: 'TRK987654321'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'processing':
        return <FaClock className="status-icon processing" />;
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />;
      default:
        return <FaShoppingBag className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#2c5e1a';
      case 'processing':
        return '#f57c00';
      case 'cancelled':
        return '#e53935';
      default:
        return '#666';
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h2>Order #{order.id}</h2>
                  <p className="order-date">Placed on {order.date}</p>
                </div>
                <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      ₹{item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="order-actions">
                  <button className="track-order-btn">
                    <FaTruck /> Track Order
                  </button>
                  {order.status === 'Delivered' && (
                    <button className="buy-again-btn">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress}</p>
                </div>
                <div className="detail-item">
                  <h4>Payment Method</h4>
                  <p>{order.paymentMethod}</p>
                </div>
                <div className="detail-item">
                  <h4>Tracking Number</h4>
                  <p>{order.trackingNumber}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders; 