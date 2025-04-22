import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cartApi';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    // Update cart count
    const updateCartCount = async () => {
      if (isAuthenticated) {
        try {
          const cartItems = await getCart();
          setCartCount(cartItems.length);
        } catch (error) {
          console.error('Error fetching cart count:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // Initial cart count
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    // Get user info if logged in
    if (token) {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userInfo);
    }

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [token, isAuthenticated]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Header with navigation */}
      <header className="bg-white shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-fresh-green-600 font-poppins text-earth-brown-500">Krishi-Connect</span>
                <span className="ml-2 text-sm text-earth-brown-500 font-roboto hidden md:inline-block">
                  Connecting Farmers & Consumers
                </span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMenu}
                className="text-earth-brown-500 hover:text-fresh-green-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Desktop search and user menu */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative flex-grow max-w-2xl mx-4">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search for products, categories or brands..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fresh-green-500 focus:border-transparent transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-2.5 text-earth-brown-400 hover:text-fresh-green-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </form>
              </div>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300">
                    <span className="w-8 h-8 rounded-full bg-fresh-green-100 flex items-center justify-center text-fresh-green-700 text-sm font-bold mr-2">
                      {user.name?.charAt(0)}
                    </span>
                    <span className="text-sm font-roboto">Hello, {user.name}</span>
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      window.location.reload();
                    }}
                    className="text-sm text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300"
                >
                  Login
                </Link>
              )}
              
              <Link to="/cart" className="flex items-center relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-earth-brown-500 hover:text-fresh-green-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-vibrant-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search bar */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-3 px-4 border-t border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-fresh-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-earth-brown-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Navigation menu */}
      <nav className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8 py-4 overflow-x-auto">
            <Link to="/" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Home</Link>
            <Link to="/category/fruits-vegetables" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Fruits & Vegetables</Link>
            <Link to="/category/dairy" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Dairy Products</Link>
            <Link to="/category/grains-cereals" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Grains & Cereals</Link>
            <Link to="/category/spices-herbs" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Spices & Herbs</Link>
            <Link to="/blog" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Farming Blog</Link>
            <Link to="/support" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">Support</Link>
            <Link to="/about" className="text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 whitespace-nowrap font-medium">About Us</Link>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-3 space-y-3">
              <Link to="/" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Home</Link>
              <Link to="/category/fruits-vegetables" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Fruits & Vegetables</Link>
              <Link to="/category/dairy" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Dairy Products</Link>
              <Link to="/category/grains-cereals" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Grains & Cereals</Link>
              <Link to="/category/spices-herbs" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Spices & Herbs</Link>
              <Link to="/blog" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Farming Blog</Link>
              <Link to="/support" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">Support</Link>
              <Link to="/about" className="block text-earth-brown-600 hover:text-fresh-green-600 transition-colors duration-300 py-2">About Us</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar; 