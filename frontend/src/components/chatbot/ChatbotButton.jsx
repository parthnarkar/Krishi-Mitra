import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import FarmingAssistant from './FarmingAssistant';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] overflow-hidden">
          <div className="bg-green-600 p-4 flex justify-between items-center">
            <h3 className="text-white font-semibold">Farming Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="h-[calc(100%-64px)]">
            <FarmingAssistant />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <FaRobot size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotButton; 