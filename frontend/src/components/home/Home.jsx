import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaHandshake, FaShoppingCart, FaArrowRight, FaLeaf, FaTruck, FaCheckCircle, FaStar, FaBox } from 'react-icons/fa';
import { getAllProducts } from '../../utils/productApi';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        // Select 4 random products to feature
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (err) {
        setError(err.message || 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-dark to-primary-color">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=1470')] bg-cover bg-center opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center">
          <div className="text-white max-w-2xl animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight drop-shadow-lg">
              Direct from Farm to Your Home
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white leading-relaxed drop-shadow-md">
              Connecting farmers directly to consumers for fresher produce and better prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/products"
                className="btn btn-primary inline-flex items-center justify-center px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl"
              >
                Shop Now <FaArrowRight className="ml-2" />
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-outline inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg rounded-lg text-white hover:bg-white hover:text-primary-color"
              >
                Farmer Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="section-title text-4xl font-bold text-neutral-800 mb-6 mx-auto">
              Our Key Features
            </h2>
            <p className="section-subtitle text-xl text-neutral-600 max-w-3xl mx-auto px-4">
              Discover how KrishiConnect is revolutionizing the way farmers and consumers connect
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4">
            <div className="card bg-white p-10 rounded-xl hover:translate-y-1 border border-neutral-100">
              <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mb-8">
                <FaWarehouse className="text-3xl text-primary-color" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-800">Cold Storage Facilities</h3>
              <p className="text-neutral-600 mb-8 text-lg">
                Book cold storage for your produce to extend shelf life and reduce waste.
              </p>
              <Link
                to="/cold-storage"
                className="inline-flex items-center text-primary-color hover:text-primary-dark font-medium group"
              >
                Book Storage <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="card bg-white p-10 rounded-xl hover:translate-y-1 border border-neutral-100">
              <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mb-8">
                <FaHandshake className="text-3xl text-primary-color" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-800">Bulk Buy Negotiation</h3>
              <p className="text-neutral-600 mb-8 text-lg">
                Negotiate directly with farmers for bulk purchases at wholesale prices.
              </p>
              <Link
                to="/bulk-buy"
                className="inline-flex items-center text-primary-color hover:text-primary-dark font-medium group"
              >
                Start Negotiation <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="card bg-white p-10 rounded-xl hover:translate-y-1 border border-neutral-100">
              <div className="w-16 h-16 bg-primary-bg rounded-full flex items-center justify-center mb-8">
                <FaShoppingCart className="text-3xl text-primary-color" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-neutral-800">Farm Fresh Marketplace</h3>
              <p className="text-neutral-600 mb-8 text-lg">
                Browse and buy fresh produce directly from local farmers near you.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center text-primary-color hover:text-primary-dark font-medium group"
              >
                Shop Products <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 px-4">
            <div className="mb-6 md:mb-0">
              <h2 className="section-title text-4xl font-bold text-neutral-800 mb-4 text-left">
                Featured Products
              </h2>
              <p className="text-xl text-neutral-600">Fresh produce from our trusted farmers</p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center text-primary-color hover:text-primary-dark font-medium text-lg group"
            >
              View All <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="bg-white rounded-xl overflow-hidden hover:translate-y-1 border border-neutral-100"
                >
                  <div className="relative h-60">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 badge badge-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      Fresh
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-secondary-color" />
                      <span className="text-neutral-600 text-sm">{product.rating}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-3">{product.name}</h3>
                    <p className="text-neutral-600 mb-3">by {product.seller?.name || 'Unknown Seller'}</p>
                    <p className="text-neutral-600 flex items-center mb-6">
                      <FaLeaf className="mr-2 text-primary-color" />
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-neutral-800">
                        ₹{product.price}
                        <span className="text-sm font-normal text-neutral-600">/{product.unit}</span>
                      </span>
                      <span className="text-sm text-gray-500">{product.quantity} {product.unit}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6 bg-neutral-50">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="section-title text-4xl font-bold text-neutral-800 mb-6 mx-auto">
              How KrishiConnect Works
            </h2>
            <p className="section-subtitle text-xl text-neutral-600 max-w-3xl mx-auto px-4">
              Simple steps to connect farmers and consumers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-4">
            {[
              {
                number: '1',
                title: 'Farmers List Produce',
                description: 'Farmers list their fresh produce, set prices, and manage inventory.',
                icon: <FaLeaf className="text-white text-lg" />
              },
              {
                number: '2',
                title: 'Consumers Shop',
                description: 'Consumers browse, select products, and place orders directly from farmers.',
                icon: <FaShoppingCart className="text-white text-lg" />
              },
              {
                number: '3',
                title: 'Delivery or Pickup',
                description: 'Products are delivered to your doorstep or available for farm pickup.',
                icon: <FaTruck className="text-white text-lg" />
              },
              {
                number: '4',
                title: 'Support Local Farming',
                description: 'Fair prices for farmers and fresh produce for consumers.',
                icon: <FaCheckCircle className="text-white text-lg" />
              }
            ].map((step, index) => (
              <div key={index} className="card text-center bg-white p-10 rounded-xl border border-neutral-100">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-color to-primary-light text-white rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-sm">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-neutral-800">{step.title}</h3>
                <p className="text-neutral-600 text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-dark to-primary-color relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1470')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-primary-dark opacity-50"></div>
        <div className="container px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-md">
            Ready to get started?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto drop-shadow-sm px-4">
            Join thousands of farmers and consumers already using KrishiConnect.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <Link
              to="/register"
              className="btn btn-secondary inline-flex items-center justify-center px-10 py-5 text-lg rounded-lg shadow-lg hover:shadow-xl bg-white text-primary-color hover:bg-neutral-50"
            >
              Sign Up Now
            </Link>
            <Link
              to="/products"
              className="btn btn-outline inline-flex items-center justify-center px-10 py-5 border-2 border-white text-lg rounded-lg text-white hover:bg-white hover:text-primary-color"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 