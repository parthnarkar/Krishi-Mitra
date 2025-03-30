import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFilter, FaSearch, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';

const Products = () => {
  const [productsList] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      price: 40,
      image: 'https://images.unsplash.com/photo-1592924357236-864f0aecab26?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dG9tYXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Green Farms Ltd.',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Fresh Potatoes',
      price: 25,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG90YXRvZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Organic Harvest Co.',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Alphonso Mangoes',
      price: 300,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bWFuZ298ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Fruits',
      seller: 'Konkan Fruit Exports',
      rating: 5.0
    },
    {
      id: 4,
      name: 'Organic Rice',
      price: 80,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmljZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Grains',
      seller: 'Pure Harvest Farms',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Fresh Carrots',
      price: 35,
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fycm90c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Organic Harvest Co.',
      rating: 4.7
    },
    {
      id: 6,
      name: 'Green Apples',
      price: 120,
      image: 'https://images.unsplash.com/photo-1569870499705-504209102861?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBhcHBsZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Fruits',
      seller: 'Fresh Fruits Inc.',
      rating: 4.9
    },
    {
      id: 7,
      name: 'Organic Onions',
      price: 30,
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8b25pb25zfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Vegetables',
      seller: 'Green Farms Ltd.',
      rating: 4.4
    },
    {
      id: 8,
      name: 'Red Chillies',
      price: 60,
      image: 'https://images.unsplash.com/photo-1589566670278-5d31c7ca1ba4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVkJTIwY2hpbGxpZXN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      category: 'Spices',
      seller: 'Spice Garden Co.',
      rating: 4.6
    }
  ]);

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy'];

  return (
    <div className="min-h-screen bg-neutral-50 pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl font-bold text-neutral-800 mb-6">Farm Fresh Products</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Browse fresh produce directly from farmers. Quality products at fair prices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 animate-fade-in">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent bg-white transition-all shadow-sm"
            />
            <FaSearch className="absolute left-4 top-4 text-neutral-400" />
          </div>
          <button className="flex items-center justify-center px-6 py-3.5 border border-neutral-200 rounded-lg hover:bg-white hover:shadow-sm transition-all bg-white shadow-sm">
            <FaFilter className="mr-2 text-primary-color" />
            <span className="font-medium">Filter</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12 animate-fade-in">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                category === activeCategory 
                  ? 'bg-primary-color text-white border-primary-color shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-color hover:text-primary-color hover:shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsList.map((product) => (
            <div
              key={product.id}
              className="card bg-white rounded-xl overflow-hidden hover:translate-y-[-0.375rem] border border-neutral-100 transition-all duration-300 group"
            >
              <Link to={`/product/${product.id}`} className="relative block h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 badge badge-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  Fresh
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <div className="p-6 relative">
                <button className="absolute right-6 top-6 text-neutral-400 hover:text-primary-color transition-colors">
                  <FaHeart />
                </button>
                
                <div className="flex items-center gap-1 mb-2">
                  <FaStar className="text-secondary-color" />
                  <span className="text-neutral-600 text-sm">{product.rating}</span>
                </div>
                
                <Link
                  to={`/product/${product.id}`}
                  className="text-lg font-semibold text-neutral-800 hover:text-primary-color transition-colors line-clamp-1 pr-6"
                >
                  {product.name}
                </Link>
                
                <p className="text-neutral-600 mt-1 text-sm">by {product.seller}</p>
                
                <div className="flex items-center mt-2 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-bg text-primary-color">
                    <FaLeaf className="mr-1 text-xs" />
                    {product.category}
                  </span>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <span className="text-xl font-bold text-neutral-800">
                    ₹{product.price}
                    <span className="text-sm font-normal text-neutral-600">/kg</span>
                  </span>
                  
                  <button className="btn btn-primary p-2.5 rounded-lg text-white shadow-sm hover:shadow-md flex items-center justify-center w-10 h-10">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16 animate-fade-in">
          <nav className="flex items-center space-x-2">
            <button className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors hover:shadow-sm bg-white">
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary-color text-white shadow-sm">
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors hover:shadow-sm bg-white">
              2
            </button>
            <button className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors hover:shadow-sm bg-white">
              3
            </button>
            <button className="px-4 py-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors hover:shadow-sm bg-white">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Products; 