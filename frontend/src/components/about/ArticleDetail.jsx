import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaTag, FaUser } from 'react-icons/fa';

const ArticleDetail = ({ articles }) => {
  const { id } = useParams();
  const article = articles.find(article => article.id === id);

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // If article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/about" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-color hover:bg-primary-dark transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Articles
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link 
            to="/about" 
            className="inline-flex items-center text-primary-color hover:text-primary-dark transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Articles
          </Link>
        </motion.div>

        {/* Article Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {/* Article Header */}
          <motion.div variants={itemVariants} className="relative">
            <div className="h-64 md:h-96 w-full overflow-hidden">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex flex-wrap items-center text-white/80 text-sm mb-3">
                <div className="flex items-center mr-4 mb-2">
                  <FaUser className="mr-1" />
                  <span>KrishiMitra Team</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <FaCalendarAlt className="mr-1" />
                  <span>{article.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  <FaTag className="mr-1" />
                  <span>{article.category}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {article.title}
              </h1>
              <p className="text-lg text-white/90 max-w-3xl">
                {article.description}
              </p>
            </div>
          </motion.div>

          {/* Article Body */}
          <motion.div variants={itemVariants} className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              {article.content.map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Additional Resources Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Resources</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-color text-white text-sm font-medium mr-3 mt-1">1</span>
                  <span className="text-gray-700">Visit your local agricultural extension office for personalized advice on implementing these techniques.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-color text-white text-sm font-medium mr-3 mt-1">2</span>
                  <span className="text-gray-700">Join our community forum to connect with other farmers and share experiences.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-color text-white text-sm font-medium mr-3 mt-1">3</span>
                  <span className="text-gray-700">Subscribe to our newsletter for the latest updates on agricultural techniques and market trends.</span>
                </li>
              </ul>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles
                  .filter(a => a.id !== article.id && a.category === article.category)
                  .slice(0, 2)
                  .map(relatedArticle => (
                    <Link 
                      key={relatedArticle.id} 
                      to={`/about/article/${relatedArticle.id}`}
                      className="group block"
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="h-40 overflow-hidden">
                          <img 
                            src={relatedArticle.imageUrl} 
                            alt={relatedArticle.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-color transition-colors duration-300">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {relatedArticle.date}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetail; 