import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFilter, FaSearch } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const [productsList] = useState([
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
    },
    {
      id: 5,
      name: 'Fresh Carrots',
      price: 35,
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fycm90c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Organic Harvest Co.'
    },
    {
      id: 6,
      name: 'Green Apples',
      price: 120,
      image: 'https://images.unsplash.com/photo-1569870499705-504209102861?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBhcHBsZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Fruits',
      seller: 'Fresh Fruits Inc.'
    },
    {
      id: 7,
      name: 'Organic Onions',
      price: 30,
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8b25pb25zfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Green Farms Ltd.'
    },
    {
      id: 8,
      name: 'Red Chillies',
      price: 60,
      image: 'https://images.unsplash.com/photo-1589566670278-5d31c7ca1ba4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVkJTIwY2hpbGxpZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Spices',
      seller: 'Spice Garden Co.'
    }
  ]);

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Farm Fresh Products</h1>
        <p>Browse fresh produce directly from farmers</p>
      </div>
      
      <div className="products-filters">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search products..." />
        </div>
        
        <div className="filter-section">
          <button className="filter-btn">
            <FaFilter /> Filter
          </button>
          
          <select className="sort-select">
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="latest">Newest First</option>
          </select>
        </div>
      </div>
      
      <div className="categories-list">
        <button className="category-item active">All</button>
        <button className="category-item">Vegetables</button>
        <button className="category-item">Fruits</button>
        <button className="category-item">Grains</button>
        <button className="category-item">Spices</button>
        <button className="category-item">Dairy</button>
      </div>
      
      <div className="products-grid">
        {productsList.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <Link to={`/product/${product.id}`} className="product-name">
                <h3>{product.name}</h3>
              </Link>
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
    </div>
  );
};

export default Products; 