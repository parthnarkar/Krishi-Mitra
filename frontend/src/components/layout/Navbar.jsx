import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWarehouse, FaHandshake, FaShoppingCart, FaUser, FaHome, FaLeaf } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <FaLeaf className="logo-icon" />
          <span>Krishi-Connect</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          
          <Link to="/products" className={`nav-link ${isActive('/products')}`}>
            <FaLeaf className="nav-icon" />
            <span>Products</span>
          </Link>
          
          <Link to="/cold-storage" className={`nav-link ${isActive('/cold-storage')}`}>
            <FaWarehouse className="nav-icon" />
            <span>Cold Storage</span>
          </Link>
          
          <Link to="/bulk-buy" className={`nav-link ${isActive('/bulk-buy')}`}>
            <FaHandshake className="nav-icon" />
            <span>Bulk Buy</span>
          </Link>
          
          <Link to="/cart" className={`nav-link ${isActive('/cart')}`}>
            <FaShoppingCart className="nav-icon" />
            <span>Cart</span>
            <span className="cart-badge">0</span>
          </Link>
          
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 