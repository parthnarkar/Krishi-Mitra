import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLocalCart } from './cart/CartUtils';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Update cart count
    const updateCartCount = () => {
      const localCart = getLocalCart();
      setCartCount(localCart.length);
    };

    // Initial cart count
    updateCartCount();

    // Listen for storage changes (for cart updates)
    window.addEventListener('storage', updateCartCount);

    // Get user info if logged in
    if (token) {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userInfo);
    }

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, [token]);

  return (
    <>
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-2xl font-bold text-green-700">FarmFresh Market</Link>
              <div className="text-sm text-gray-500">
                Fresh & Healthy
              </div>
            </div>
            
            <div className="relative flex-grow max-w-2xl mx-4">
              <input
                type="text"
                placeholder="Search for products, categories or brands..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button className="absolute right-3 top-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm">Hello, {user.name}</span>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.reload();
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-green-600 hover:text-green-800"
                >
                  Login
                </Link>
              )}
              
              <Link to="/cart" className="flex items-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation menu */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <Link to="/" className="text-gray-800 hover:text-green-600">Home</Link>
            <Link to="/shop" className="text-gray-800 hover:text-green-600">Shop</Link>
            <Link to="/fruits-vegetables" className="text-gray-800 hover:text-green-600">Fruits & Vegetables</Link>
            <Link to="/beverages" className="text-gray-800 hover:text-green-600">Beverages</Link>
            <Link to="/blog" className="text-gray-800 hover:text-green-600">Blog</Link>
            <Link to="/contact" className="text-gray-800 hover:text-green-600">Contact</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar; 