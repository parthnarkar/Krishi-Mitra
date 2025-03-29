const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');
const { v4: uuidv4 } = require('uuid');
const geminiAPI = require('../utils/geminiAPI');
require('dotenv').config();

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'bn', name: 'Bengali' },
];

// Get or create a session
exports.getSession = async (req, res) => {
  try {
    const { userId } = req.body;
    const sessionId = uuidv4();
    
    return res.status(200).json({ sessionId });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({ message: 'Failed to create session' });
  }
};

// Get chat history for a session
exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const messages = await ChatMessage.find({ sessionId })
      .sort({ timestamp: 1 });
    
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return res.status(500).json({ message: 'Failed to fetch chat history' });
  }
};

// Send a message to the chatbot
exports.sendMessage = async (req, res) => {
  try {
    const { userId, sessionId, message, language = 'en' } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ message: 'Message and sessionId are required' });
    }
    
    console.log(`Processing message: "${message}" with sessionId: ${sessionId} in language: ${language}`);

    // Validate Gemini API key
    if (!process.env.GEMINI_KEY) {
      console.error('Invalid Gemini API key. Please set a valid key in the .env file.');
      return res.status(500).json({ 
        message: "I'm having trouble connecting to my knowledge base. Please check the API configuration.",
        error: "Gemini API key not configured"
      });
    }
    
    // Use the provided language parameter
    const userLanguage = language;
    
    // Save user message to database
    try {
      const userMessage = new ChatMessage({
        userId,
        sessionId,
        message,
        isUser: true,
        language: userLanguage,
      });
      await userMessage.save();
      console.log('User message saved to database');
    } catch (dbError) {
      console.error('Error saving user message to database:', dbError);
      // Continue processing even if DB save fails
    }
    
    // Process the message in English if it's not already
    let processMessage = message;
    if (userLanguage !== 'en') {
      try {
        // Use Gemini to translate to English for better understanding
        console.log(`Translating user message from ${userLanguage} to English`);
        processMessage = await geminiAPI.translateText(message, 'en');
        console.log(`Translated message: "${processMessage}"`);
      } catch (translateError) {
        console.error('Error translating user message to English:', translateError);
        // Continue with original message if translation fails
        console.log('Continuing with original message');
      }
    }
    
    // Create the system prompt for farming knowledge
    const systemPrompt = `You are KrishiMitra, an agricultural assistant for Krishi-Connect. 
    You specialize in providing guidance on farming techniques, crop management, sustainable agriculture, 
    organic farming, pest control, soil health, water management, and other agricultural topics. 
    Your responses should be helpful, educational, and practical for farmers in India. 
    If you're asked about topics unrelated to agriculture, politely redirect the conversation 
    to farming-related topics. Keep your responses concise yet informative.`;
    
    // Prepare the chat history for context
    let chatHistory = [];
    try {
      chatHistory = await ChatMessage.find({ sessionId })
        .sort({ timestamp: 1 })
        .limit(10); // Limit to last 10 messages for context
      console.log(`Retrieved ${chatHistory.length} previous messages for context`);
    } catch (historyError) {
      console.error('Error retrieving chat history:', historyError);
      // Continue without history if retrieval fails
    }
    
    // Format chat history for context
    let contextPrompt = "";
    if (chatHistory.length > 0) {
      contextPrompt = "Here is our conversation so far:\n\n";
      chatHistory.forEach(msg => {
        contextPrompt += `${msg.isUser ? 'User' : 'KrishiMitra'}: ${msg.message}\n\n`;
      });
      contextPrompt += "Now, respond to the user's latest message below:\n\n";
    }
    
    const fullPrompt = `${contextPrompt}User: ${processMessage}`;
    
    console.log('Sending request to Gemini API...');
    
    try {
      // Call Gemini API
      const botResponse = await geminiAPI.generateContent(fullPrompt, systemPrompt);
      
      console.log(`Generated response: "${botResponse}"`);
      
      // Translate response if needed
      let translatedResponse = botResponse;
      if (userLanguage !== 'en') {
        try {
          console.log(`Translating response to ${userLanguage}`);
          translatedResponse = await geminiAPI.translateText(botResponse, userLanguage);
          console.log(`Translated response: "${translatedResponse}"`);
        } catch (translateError) {
          console.error('Error translating response:', translateError);
          translatedResponse = botResponse; // Use original response if translation fails
        }
      }
      
      // Save bot response to database
      try {
        const botMessage = new ChatMessage({
          userId,
          sessionId,
          message: translatedResponse,
          isUser: false,
          language: userLanguage,
        });
        await botMessage.save();
      } catch (dbError) {
        console.error('Error saving bot response to database:', dbError);
        // Continue even if DB save fails
      }
      
      return res.status(200).json({ message: translatedResponse });
    } catch (apiError) {
      console.error('Error calling Gemini API:', apiError);
      
      // Return a fallback response
      const fallbackResponse = {
        en: "I'm having trouble connecting to my knowledge base. Please try again later.",
        hi: "मुझे अपने ज्ञान आधार से कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।",
        mr: "मला माझ्या ज्ञान आधारशी कनेक्ट करण्यात समस्या येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.",
        te: "నా నాలెడ్జ్ బేస్‌కి కనెక్ట్ చేయడంలో సమస్య ఉంది. దయచేసి తర్వాత మళ్ళీ ప్రయత్నించండి.",
        ta: "என் அறிவுத் தளத்துடன் இணைப்பதில் எனக்கு சிக்கல் உள்ளது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.",
        gu: "મને મારા નોલેજ બેઝ સાથે કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને પછી ફરી પ્રયાસ કરો.",
        pa: "ਮੈਨੂੰ ਆਪਣੇ ਗਿਆਨ ਅਧਾਰ ਨਾਲ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
        bn: "আমার জ্ঞান ভিত্তির সাথে সংযোগ করতে আমার সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"
      };
      
      const errorMessage = fallbackResponse[userLanguage] || fallbackResponse.en;
      
      // Save error response to database
      try {
        const errorMsg = new ChatMessage({
          userId,
          sessionId,
          message: errorMessage,
          isUser: false,
          language: userLanguage,
        });
        await errorMsg.save();
      } catch (dbError) {
        console.error('Error saving fallback response to database:', dbError);
      }
      
      return res.status(200).json({ message: errorMessage, error: apiError.message });
    }
  } catch (error) {
    console.error('Error processing message:', error);
    return res.status(500).json({ 
      message: "I'm sorry, I'm having trouble processing your request. Please try again.",
      error: error.message 
    });
  }
}; 