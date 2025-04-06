import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaLeaf, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-all hover:scale-105 duration-300">
            <div className="w-10 h-10 rounded-full bg-primary-bg flex items-center justify-center">
              <FaLeaf className="text-2xl text-primary-color" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary-light">KrishiConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-neutral-600 hover:text-primary-color transition-colors">Home</Link>
            <Link to="/products" className="text-neutral-600 hover:text-primary-color transition-colors">Products</Link>
            <Link to="/about" className="text-neutral-600 hover:text-primary-color transition-colors">About</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-primary-color transition-colors">Contact</Link>
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent bg-neutral-50 w-52 transition-all duration-300 focus:w-72 group-hover:shadow-sm"
              />
              <FaSearch className="absolute left-3 top-2.5 text-neutral-400" />
            </div>
            <Link
              to="/cart"
              className="relative text-neutral-600 hover:text-primary-color transition-colors"
            >
              <FaShoppingCart className="text-xl hover:scale-110 transition-transform duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-neutral-600 hover:text-primary-color transition-colors">
              <FaUser className="text-xl hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-600 hover:text-primary-color transition-colors"
          >
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-neutral-100 shadow-lg">
            <div className="flex flex-col py-2">
              <Link
                to="/"
                className="block px-4 py-3 text-neutral-600 hover:text-primary-color hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-3 text-neutral-600 hover:text-primary-color hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-4 py-3 text-neutral-600 hover:text-primary-color hover:bg-neutral-50 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 text-neutral-600 hover:text-primary-color hover:bg-neutral-50 rounded-lg transition-colors"
              >
                Contact
              </Link>
              <div className="px-4 py-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent bg-neutral-50"
                  />
                  <FaSearch className="absolute left-3 top-4 text-neutral-400" />
                </div>
              </div>
              <div className="flex items-center space-x-5 px-4 py-3 border-t border-neutral-100 pt-4">
                <Link
                  to="/cart"
                  className="relative text-neutral-600 hover:text-primary-color transition-colors"
                >
                  <FaShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-color text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-neutral-600 hover:text-primary-color transition-colors">
                  <FaUser className="text-xl" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 