import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLeaf, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <FaLeaf className="footer-logo-icon" />
            <h3>Krishi-Connect</h3>
          </div>
          <p className="footer-tagline">Connecting Farmers to Consumers</p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cold-storage">Cold Storage</Link></li>
            <li><Link to="/bulk-buy">Bulk Buy</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Services</h4>
          <ul className="footer-links">
            <li><Link to="/cold-storage">Cold Storage Booking</Link></li>
            <li><Link to="/bulk-buy">Bulk Buy Negotiation</Link></li>
            <li><Link to="/products">Online Marketplace</Link></li>
            <li><Link to="/">Farm to Home Delivery</Link></li>
            <li><Link to="/">Quality Assurance</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <address className="footer-contact">
            <p><FaMapMarkerAlt /> 123 Agri Lane, Rural District</p>
            <p><FaPhone /> +91 9876543210</p>
            <p><FaEnvelope /> info@krishiconnect.com</p>
          </address>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Krishi-Connect. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 