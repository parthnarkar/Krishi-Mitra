import React, { useState } from 'react';
import { FaLeaf, FaHandshake, FaTruck, FaUsers, FaSearch, FaFilter, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ArticleCard from '../components/about/ArticleCard';
import articles from '../data/articles';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const features = [
    {
      id: 'direct-sourcing',
      icon: <FaLeaf className="h-6 w-6 text-green-600" />,
      title: 'Direct Farm Sourcing',
      description: 'We connect you directly with local farmers, ensuring fresh produce and fair prices.'
    },
    {
      id: 'fair-trade',
      icon: <FaHandshake className="h-6 w-6 text-green-600" />,
      title: 'Fair Trade Practices',
      description: 'Supporting sustainable farming through fair pricing and transparent transactions.'
    },
    {
      id: 'delivery',
      icon: <FaTruck className="h-6 w-6 text-green-600" />,
      title: 'Quick Delivery',
      description: 'Fast and reliable delivery service to bring fresh produce right to your doorstep.'
    },
    {
      id: 'community',
      icon: <FaUsers className="h-6 w-6 text-green-600" />,
      title: 'Community Support',
      description: 'Building a strong community of farmers and consumers for sustainable agriculture.'
    }
  ];

  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = ['all', ...new Set(articles.map(article => article.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 animate-fade-in-up"
        >
          <div className="inline-block mb-4 p-2 bg-green-100 rounded-full">
            <FaLeaf className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-brown-800 font-poppins mb-4 tracking-tight">
            About Krishi-Connect
          </h1>
          <p className="text-lg text-brown-600 max-w-3xl mx-auto leading-relaxed">
            Empowering farmers and consumers through direct farm-to-table connections,
            promoting sustainable agriculture and fair trade practices.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-green-500"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-brown-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-brown-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl p-8 mb-16 border-t-4 border-green-500"
        >
          <h2 className="text-2xl font-bold text-brown-800 mb-4 text-center font-poppins">
            Our Mission
          </h2>
          <p className="text-brown-600 text-center max-w-3xl mx-auto">
            At Krishi-Connect, we're committed to revolutionizing the agricultural marketplace
            by creating a direct bridge between farmers and consumers. Our platform
            ensures fair prices for farmers while providing consumers with access to
            fresh, high-quality produce at reasonable prices.
          </p>
        </motion.div>

        {/* Knowledge Hub Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-brown-800 mb-8 text-center font-poppins">
            Knowledge Hub
          </h2>
          <p className="text-brown-600 text-center max-w-3xl mx-auto mb-8">
            Explore our collection of articles, guides, and resources designed to empower farmers
            and educate consumers about sustainable agriculture, market trends, and best practices.
          </p>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 mb-8 border-t-4 border-green-500">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-brown-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg hover:shadow-xl border-t-4 border-green-500">
              <p className="text-brown-600 text-lg">
                No articles found matching your criteria. Try adjusting your search or filter.
              </p>
            </div>
          )}
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative overflow-hidden"
        >
          <motion.div 
            className="bg-gradient-to-br from-green-900 via-green-800 to-green-600 rounded-2xl shadow-lg p-12 text-white text-center relative overflow-hidden group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* Floating Elements */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1 }}
              className="absolute top-10 right-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-2xl"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute bottom-10 left-10 w-40 h-40 bg-amber-400 rounded-full mix-blend-multiply filter blur-2xl"
            />

            <Link to="/contact" className="block relative z-10">
              <motion.div
                initial="initial"
                whileHover="hover"
                className="relative"
              >
                <motion.div
                  className="mb-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                    <FaEnvelope className="text-4xl text-white" />
                  </div>
                </motion.div>

                <h2 className="text-3xl font-bold mb-4 drop-shadow-md font-poppins">Get in Touch</h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Have questions or suggestions? We'd love to hear from you! 
                  Let's start a conversation about how we can help.
                </p>

                <motion.div
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white text-green-800 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Contact Us
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </motion.div>
            </Link>

            {/* Decorative dots */}
            <div className="absolute top-8 right-8 w-24 h-24 grid grid-cols-3 gap-2 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
              ))}
            </div>
            <div className="absolute bottom-8 left-8 w-24 h-24 grid grid-cols-3 gap-2 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 