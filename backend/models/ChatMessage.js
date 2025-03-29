const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Anonymous users can also chat
  },
  sessionId: {
    type: String,
    required: true, // To group messages by conversation
  },
  message: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    default: true, // true if message is from user, false if from bot
  },
  language: {
    type: String,
    default: 'en', // Default language is English
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 