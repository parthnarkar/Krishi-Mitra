import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import ChatbotDialog from './ChatbotDialog';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center hover:from-green-500 hover:to-green-400"
        aria-label="Open AI Assistant"
      >
        <FaRobot className="text-2xl" />
      </button>

      {isOpen && <ChatbotDialog onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatbotButton; 