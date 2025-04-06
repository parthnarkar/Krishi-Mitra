import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaFilter, FaSearch, FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';

// Loading skeleton component with clean animation
const LoadingSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-[60vh] flex flex-col items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 mx-auto mb-4"
      >
        <FaLeaf className="w-full h-full text-primary-color" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-neutral-800">Loading Fresh Products</h2>
      <p className="text-neutral-600 mt-2">Please wait while we fetch the latest items...</p>
    </motion.div>

    <div className="w-full max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm"
          >
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="aspect-square bg-neutral-100 rounded-lg mb-4"
            />
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-4 bg-neutral-100 rounded w-3/4 mb-2"
            />
            <motion.div
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-4 bg-neutral-100 rounded w-1/2"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy'];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProductsList([
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
      setLoading(false);
    }, 1500); // Increased delay for better loading experience
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-neutral-50 pt-32 pb-20"
      >
        <div className="container mx-auto px-6">
          <LoadingSkeleton />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-50 pt-32 pb-20"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-4xl font-bold text-neutral-800 mb-6"
          >
            Farm Fresh Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-600 max-w-2xl mx-auto text-lg"
          >
            Browse fresh produce directly from farmers. Quality products at fair prices.
          </motion.p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative flex-1"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-color focus:border-transparent bg-white transition-all shadow-sm"
            />
            <motion.div 
              animate={{ rotate: searchQuery ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className="absolute left-4 top-4 text-neutral-400"
            >
              <FaSearch />
            </motion.div>
          </motion.div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center px-6 py-3.5 border border-neutral-200 rounded-lg hover:bg-white hover:shadow-sm transition-all bg-white shadow-sm"
          >
            <FaFilter className="mr-2 text-primary-color" />
            <span className="font-medium">Filter</span>
          </motion.button>
        </motion.div>

        {/* Categories */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
                category === activeCategory 
                  ? 'bg-primary-color text-white border-primary-color shadow-sm' 
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-color hover:text-primary-color hover:shadow-sm'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="wait">
            {productsList.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="card bg-white rounded-xl overflow-hidden border border-neutral-100 transition-all duration-300 group"
              >
                <Link to={`/product/${product.id}`} className="relative block h-64 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 badge badge-primary px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                  >
                    Fresh
                  </motion.div>
                </Link>
                
                <div className="p-6 relative">
                  <motion.button 
                    whileHover={{ scale: 1.2, color: "#ef4444" }}
                    className="absolute right-6 top-6 text-neutral-400 transition-colors"
                  >
                    <FaHeart />
                  </motion.button>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 mb-2"
                  >
                    <FaStar className="text-secondary-color" />
                    <span className="text-neutral-600 text-sm">{product.rating}</span>
                  </motion.div>
                  
                  <Link
                    to={`/product/${product.id}`}
                    className="text-lg font-semibold text-neutral-800 hover:text-primary-color transition-colors line-clamp-1 pr-6"
                  >
                    {product.name}
                  </Link>
                  
                  <p className="text-neutral-600 mt-1 text-sm">by {product.seller}</p>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center mt-2 text-sm"
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-bg text-primary-color">
                      <FaLeaf className="mr-1 text-xs" />
                      {product.category}
                    </span>
                  </motion.div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className="text-xl font-bold text-neutral-800"
                    >
                      ₹{product.price}
                      <span className="text-sm font-normal text-neutral-600">/kg</span>
                    </motion.span>
                    
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="btn btn-primary p-2.5 rounded-lg text-white shadow-sm hover:shadow-md flex items-center justify-center w-10 h-10"
                    >
                      <FaShoppingCart />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <nav className="flex items-center space-x-2">
            {['Previous', '1', '2', '3', 'Next'].map((item, index) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`px-4 py-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors hover:shadow-sm bg-white ${
                  item === '1' ? 'bg-primary-color text-white border-primary-color' : ''
                }`}
              >
                {item}
              </motion.button>
            ))}
          </nav>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products; 