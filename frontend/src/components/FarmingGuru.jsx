import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../styles/FarmingGuru.css';

// This component would integrate with an AI API like OpenAI or Google's Gemini in a real implementation
const FarmingGuru = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm FarmingGuru, your agricultural assistant. How can I help you today?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  
  // Predefined suggestions for the user
  const suggestions = [
    "How to grow tomatoes?",
    "Best practices for organic farming",
    "Dealing with plant diseases",
    "Crop rotation techniques",
    "Water conservation methods"
  ];

  useEffect(() => {
    // Scroll to the bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const addMessage = (text, sender) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender
    };
    setMessages([...messages, newMessage]);
  };

  const getAIResponse = async (userMessage) => {
    setIsTyping(true);
    try {
      // In a real app, this would be an API call to your backend or a service like OpenAI
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        let response;
        
        // Simple response logic based on keywords
        if (userMessage.toLowerCase().includes('tomato') || userMessage.toLowerCase().includes('grow')) {
          response = "To grow tomatoes successfully, ensure they receive 6-8 hours of sunlight daily, plant them in well-draining soil enriched with compost, water consistently, and stake/cage them for support as they grow.";
        } else if (userMessage.toLowerCase().includes('organic')) {
          response = "Organic farming focuses on ecosystem health and biodiversity. Use natural pest controls, rotate crops, implement composting, and avoid synthetic chemicals to maintain soil health and sustainability.";
        } else if (userMessage.toLowerCase().includes('disease')) {
          response = "For plant diseases, practice prevention through crop rotation, proper spacing, and resistant varieties. At first signs, identify the disease and apply appropriate organic or chemical treatments. Remove affected plants if necessary to prevent spread.";
        } else if (userMessage.toLowerCase().includes('water') || userMessage.toLowerCase().includes('irrigation')) {
          response = "Water conservation in farming can be achieved through drip irrigation, rainwater harvesting, mulching to reduce evaporation, and planting drought-resistant crops when appropriate for your region.";
        } else {
          response = "That's an interesting question about agriculture. For more specific advice, could you provide more details about your farming context or particular crops?";
        }
        
        addMessage(response, 'bot');
        setIsTyping(false);
      }, 1500);
      
      // In a real implementation, you would use something like:
      // const response = await axios.post('/api/chatbot', { message: userMessage });
      // addMessage(response.data.message, 'bot');
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage("Sorry, I encountered a problem. Please try again later.", 'bot');
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    addMessage(inputMessage, 'user');
    getAIResponse(inputMessage);
    setInputMessage('');
  };

  const handleSuggestionClick = (suggestion) => {
    addMessage(suggestion, 'user');
    getAIResponse(suggestion);
  };

  return (
    <div className="farming-guru-container">
      {/* Chat toggle button */}
      <button 
        className="farming-guru-toggle" 
        onClick={toggleChat}
        aria-label={isOpen ? "Close farming assistant" : "Open farming assistant"}
      >
        {isOpen ? '✕' : '🌱'}
        {!isOpen && <span className="toggle-label">Farming Guru</span>}
      </button>
      
      {/* Chat interface */}
      {isOpen && (
        <div className="farming-guru-chat">
          <div className="chat-header">
            <h3>Farming Guru</h3>
            <p>Your AI Agricultural Assistant</p>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot-message typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          
          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="chat-suggestions">
              <p>Try asking about:</p>
              <div className="suggestions-container">
                {suggestions.map((suggestion, index) => (
                  <button 
                    key={index} 
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input form */}
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Ask about farming..."
              aria-label="Chat message"
            />
            <button type="submit" disabled={!inputMessage.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FarmingGuru; 