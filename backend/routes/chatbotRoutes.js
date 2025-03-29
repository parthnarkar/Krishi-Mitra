const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Get a new session ID
router.post('/session', chatbotController.getSession);

// Get chat history
router.get('/history/:sessionId', chatbotController.getChatHistory);

// Send a message to the chatbot
router.post('/message', chatbotController.sendMessage);

module.exports = router; 