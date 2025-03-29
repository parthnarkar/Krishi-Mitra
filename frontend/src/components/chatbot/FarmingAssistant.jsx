import React from 'react';

const FarmingAssistant = () => {
  return (
    <section className="mb-12 bg-gradient-to-r from-green-800 to-green-600 rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row items-center p-8">
        <div className="md:w-2/3 mb-6 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">KrishiMitra - Your Digital Farming Assistant</h2>
          <p className="text-white text-opacity-90 mb-6">
            Have questions about farming techniques, pest control, organic farming, or crop management? Our AI-powered assistant is here to help you 24/7 in multiple Indian languages.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Expert Farming Advice
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Multi-Language Support
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              24/7 Availability
            </div>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1581349485608-9469926a8e5e?q=80&w=1470" 
              alt="AI Farming Assistant" 
              className="h-48 md:h-64 rounded-lg shadow-lg object-cover"
            />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              NEW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FarmingAssistant; 