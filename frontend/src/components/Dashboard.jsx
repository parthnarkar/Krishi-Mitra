import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { addToCart } from '../utils/cartUtils';

const API_URL = 'http://localhost:5000/api';

// Fallback product data for when API is unavailable
const fallbackProducts = [
  {
    _id: '1',
    name: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes grown without pesticides',
    price: 40,
    discountPrice: 35,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfad?q=80&w=2070',
    stock: 50,
    isOrganic: true
  },
  {
    _id: '2',
    name: 'Fresh Spinach',
    description: 'Locally grown spinach, perfect for salads and cooking',
    price: 30,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=2432',
    stock: 30,
    isOrganic: true
  },
  {
    _id: '3',
    name: 'Whole Wheat Flour',
    description: 'Stone-ground whole wheat flour for baking',
    price: 60,
    discountPrice: 55,
    category: 'Grains & Cereals',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072',
    stock: 100,
    isOrganic: false
  },
  {
    _id: '4',
    name: 'Farm Fresh Milk',
    description: 'Fresh cow milk delivered daily',
    price: 50,
    category: 'Dairy Products',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=2070',
    stock: 20,
    isOrganic: true
  },
  {
    _id: '5',
    name: 'Turmeric Powder',
    description: 'Organic turmeric powder for cooking and health benefits',
    price: 80,
    category: 'Spices & Herbs',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f1?q=80&w=2070',
    stock: 40,
    isOrganic: true
  },
  {
    _id: '6',
    name: 'Organic Apples',
    description: 'Sweet and crisp apples from organic orchards',
    price: 70,
    discountPrice: 65,
    category: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070',
    stock: 60,
    isOrganic: true
  },
  {
    _id: '7',
    name: 'Basmati Rice',
    description: 'Premium long-grain basmati rice',
    price: 120,
    category: 'Grains & Cereals',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=2070',
    stock: 50,
    isOrganic: false
  },
  {
    _id: '8',
    name: 'Organic Honey',
    description: 'Pure unfiltered honey from local beekeepers',
    price: 150,
    category: 'Dairy Products',
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=2080',
    stock: 25,
    isOrganic: true
  }
];

// Fallback categories data
const fallbackCategories = [
  {
    _id: '1',
    name: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=2070'
  },
  {
    _id: '2',
    name: 'Dairy Products',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=2070'
  },
  {
    _id: '3',
    name: 'Grains & Cereals',
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=2142'
  },
  {
    _id: '4',
    name: 'Spices & Herbs',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=2070'
  }
];

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Auth token from localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use fallback categories data
        setCategories(fallbackCategories);
      }
    };

    // Function to fetch products
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/products`, {
          params: { category: selectedCategory, search: searchTerm }
        });
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        
        // Use the fallback data but apply filtering based on selectedCategory and searchTerm
        let filteredProducts = [...fallbackProducts];
        
        // Apply category filter
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(
            product => product.category === selectedCategory
          );
        }
        
        // Apply search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredProducts = filteredProducts.filter(
            product => 
              product.name.toLowerCase().includes(searchLower) || 
              product.description.toLowerCase().includes(searchLower) ||
              product.category.toLowerCase().includes(searchLower)
          );
        }
        
        setProducts(filteredProducts);
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  // Function to add item to cart
  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigation when clicking the cart button
    addToCart(product);
    
    // Show toast notification
    alert(`${product.name} added to cart!`);
  };

  // Function to filter products by category
  const filterByCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Function to handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Apply search filter
      fetchProducts();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-700 to-green-500 rounded-xl p-8 text-white mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Farm Fresh Products Delivered Direct To You
              </h2>
              <p className="text-lg mb-6">
                Support local farmers and enjoy fresh, seasonal produce at affordable prices
              </p>
              <div className="bg-white p-2 rounded-lg flex">
                <form onSubmit={handleSearchSubmit} className="flex w-full">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    className="flex-grow bg-transparent text-gray-800 outline-none px-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Search
                  </button>
                </form>
              </div>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                alt="Fresh Produce" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Featured Farmers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meet Our Farmers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1553787499-6f9133860278?w=500" 
                  alt="Farmer Ravi" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Farmer Ravi</h3>
              <p className="text-sm text-gray-600">Organic Vegetables</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500" 
                  alt="Farmer Priya" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Farmer Priya</h3>
              <p className="text-sm text-gray-600">Fruits Specialist</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1610275280978-51f3f5324c83?w=500" 
                  alt="Farmer Ajay" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Farmer Ajay</h3>
              <p className="text-sm text-gray-600">Dairy Products</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                <img 
                  src="https://images.unsplash.com/photo-1594547915764-b92fc34c8ad7?w=500" 
                  alt="Farmer Kavita" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium">Farmer Kavita</h3>
              <p className="text-sm text-gray-600">Spices & Herbs</p>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div 
                key={category._id}
                onClick={() => filterByCategory(category.name)}
                className={`bg-white rounded-lg shadow-sm p-4 flex flex-col items-center cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.name ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-center">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory('')}
                className="text-green-600 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link to={`/product/${product._id}`} className="block h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link to={`/product/${product._id}`} className="font-medium hover:text-green-600">
                        {product.name}
                      </Link>
                      {product.isOrganic && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Organic
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {product.discountPrice ? (
                          <>
                            <span className="font-bold text-lg">₹{product.discountPrice}</span>
                            <span className="text-gray-500 line-through ml-2">₹{product.price}</span>
                          </>
                        ) : (
                          <span className="font-bold text-lg">₹{product.price}</span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && !isLoading && (
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg text-center">
              No products found. Try changing your search or filter.
            </div>
          )}
        </section>

        {/* Direct from Farm Section */}
        <section className="mt-16 p-8 bg-green-50 rounded-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Why Choose Farm Direct?</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              When you buy directly from farmers, you get fresher, healthier produce while supporting local agriculture
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Freshness Guaranteed</h3>
              <p className="text-gray-600">
                Products are harvested and delivered within 24 hours, ensuring maximum freshness and nutritional value.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                By eliminating middlemen, farmers earn more while you pay less for higher quality produce.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Local Farming</h3>
              <p className="text-gray-600">
                Your purchase directly supports local farming communities and sustainable agricultural practices.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">FarmFresh Market</h3>
              <p className="text-green-200">
                Connecting farmers directly with consumers for the freshest produce at fair prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-200 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">How It Works</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">For Farmers</a></li>
                <li><a href="#" className="text-green-200 hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-green-200 mb-2">
                Subscribe to get updates on new products and seasonal offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-green-700 text-white px-3 py-2 rounded-l outline-none flex-grow"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded-r">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200">
            <p>&copy; 2023 FarmFresh Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
