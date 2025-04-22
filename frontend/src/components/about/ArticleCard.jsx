import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt, FaTag } from 'react-icons/fa';

const ArticleCard = ({ article }) => {
  const { id, title, description, category, imageUrl, date } = article;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] border-t-4 border-green-500"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-brown-600 text-sm mb-2">
          <div className="flex items-center mr-3">
            <FaCalendarAlt className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <FaTag className="mr-1" />
            <span>{category}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-brown-800 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-brown-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <Link 
          to={`/about/article/${id}`}
          className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors group"
        >
          Read More
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleCard; 