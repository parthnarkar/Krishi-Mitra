import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaChevronRight } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-white relative">
      {/* Top Curves */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
        <div className="absolute inset-0 bg-neutral-50"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-auto transform translate-y-1/2">
          <path 
            fill="rgb(31, 41, 55)" 
            fillOpacity="1" 
            d="M0,192L48,186.7C96,181,192,171,288,186.7C384,203,480,245,576,245.3C672,245,768,203,864,186.7C960,171,1056,181,1152,186.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 animate-fade-in">
          {/* Company Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <div className="text-2xl font-bold text-white">K</div>
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-color to-primary-light">
                KrishiConnect
              </h2>
            </div>
            <p className="text-neutral-300 mb-8 leading-relaxed">
              Empowering farmers and connecting them directly with consumers for a sustainable agricultural ecosystem.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-primary-color hover:text-white transition-all duration-300 hover:scale-110">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-primary-color hover:text-white transition-all duration-300 hover:scale-110">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-primary-color hover:text-white transition-all duration-300 hover:scale-110">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-300 hover:bg-primary-color hover:text-white transition-all duration-300 hover:scale-110">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block pb-2">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-color"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Products</span>
                </Link>
              </li>
              <li>
                <Link to="/cold-storage" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Cold Storage</span>
                </Link>
              </li>
              <li>
                <Link to="/bulk-buy" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Bulk Buy</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Farmer Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block pb-2">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-color"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Farm Fresh Products</span>
                </Link>
              </li>
              <li>
                <Link to="/cold-storage" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Cold Storage Booking</span>
                </Link>
              </li>
              <li>
                <Link to="/bulk-buy" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Bulk Purchase</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Order Tracking</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-white transition-colors flex items-center group">
                  <FaChevronRight className="text-xs text-primary-color group-hover:translate-x-1 transition-transform" />
                  <span className="ml-2">Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-semibold mb-6 relative inline-block pb-2">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-color"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-primary-color">
                  <FaMapMarkerAlt />
                </div>
                <span className="text-neutral-300">
                  D10A , 5th Floor <br />
                  514 , VESIT <br />
                  Maharashtra, India
                </span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-primary-color">
                  <FaPhone />
                </div>
                <span className="text-neutral-300">+91 81044 39075</span>
              </li>
              <li className="flex items-center">
                <div className="mr-3 w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-primary-color">
                  <FaEnvelope />
                </div>
                <span className="text-neutral-300">krishiconnect@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-700 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} KrishiConnect. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-neutral-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <span className="text-neutral-400 text-sm hidden md:inline">
              Empowering farmers through technology
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 