import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaLock, FaFacebookF, FaGoogle } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, just console log the form data
    console.log('Form submitted:', formData);
    // In a real app, you would call an API to authenticate
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className="login-btn">Sign In</button>
          
          <div className="login-divider">
            <span>or sign in with</span>
          </div>
          
          <div className="social-login">
            <button type="button" className="social-btn facebook">
              <FaFacebookF />
              <span>Facebook</span>
            </button>
            
            <button type="button" className="social-btn google">
              <FaGoogle />
              <span>Google</span>
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>
            Don't have an account? 
            <Link to="/register" className="register-link"> Register</Link>
          </p>
        </div>
      </div>
      
      <div className="login-image">
        <div className="image-overlay">
          <h2>Farm to Table</h2>
          <p>Supporting farmers, empowering communities</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 