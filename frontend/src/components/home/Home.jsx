import React from 'react';
import { Link } from 'react-router-dom';
import { FaWarehouse, FaHandshake, FaShoppingCart, FaArrowRight, FaLeaf } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  // Sample featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Organic Tomatoes',
      price: 40,
      image: 'https://images.unsplash.com/photo-1592924357236-864f0aecab26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Green Farms Ltd.'
    },
    {
      id: 2,
      name: 'Fresh Potatoes',
      price: 25,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG90YXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Organic Harvest Co.'
    },
    {
      id: 3,
      name: 'Alphonso Mangoes',
      price: 300,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuZ298ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Fruits',
      seller: 'Konkan Fruit Exports'
    },
    {
      id: 4,
      name: 'Organic Rice',
      price: 80,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmljZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Grains',
      seller: 'Pure Harvest Farms'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Direct from Farm to Your Home</h1>
          <p>Connecting farmers directly to consumers for fresher produce and better prices.</p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary">
              Shop Now <FaArrowRight />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Farmer Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Our Key Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon cold-storage">
              <FaWarehouse />
            </div>
            <h3>Cold Storage Facilities</h3>
            <p>Book cold storage for your produce to extend shelf life and reduce waste.</p>
            <Link to="/cold-storage" className="feature-link">
              Book Storage <FaArrowRight />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon bulk-buy">
              <FaHandshake />
            </div>
            <h3>Bulk Buy Negotiation</h3>
            <p>Negotiate directly with farmers for bulk purchases at wholesale prices.</p>
            <Link to="/bulk-buy" className="feature-link">
              Start Negotiation <FaArrowRight />
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon marketplace">
              <FaShoppingCart />
            </div>
            <h3>Farm Fresh Marketplace</h3>
            <p>Browse and buy fresh produce directly from local farmers near you.</p>
            <Link to="/products" className="feature-link">
              Shop Products <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all">
            View All <FaArrowRight />
          </Link>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-seller">by {product.seller}</p>
                <p className="product-category">
                  <FaLeaf /> {product.category}
                </p>
                <div className="product-price-row">
                  <span className="product-price">₹{product.price}/kg</span>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* How it Works */}
      <section className="how-it-works">
        <h2>How Krishi-Connect Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Farmers List Produce</h3>
            <p>Farmers list their fresh produce, set prices, and manage inventory.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Consumers Shop</h3>
            <p>Consumers browse, select products, and place orders directly from farmers.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Delivery or Pickup</h3>
            <p>Products are delivered to your doorstep or available for farm pickup.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Support Local Farming</h3>
            <p>Fair prices for farmers and fresh produce for consumers.</p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to get started?</h2>
          <p>Join thousands of farmers and consumers already using Krishi-Connect.</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up Now
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 