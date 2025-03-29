const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Basic function to generate content with Gemini
exports.generateContent = async (prompt, systemPrompt = "", model = "gemini-2.0-flash") => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const endpoint = `${GEMINI_API_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    };

    // Add system instruction if provided
    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response structure from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('API response:', error.response.data);
    }
    throw error;
  }
};

// Function to translate text using Gemini
exports.translateText = async (text, targetLanguage) => {
  if (targetLanguage === 'en' || text.length < 5) {
    return text;
  }
  
  try {
    const prompt = `Translate the following text to ${getLangName(targetLanguage)}. Only provide the translation without any explanation or additional text.\n\nText: "${text}"`;
    
    return await exports.generateContent(prompt);
  } catch (error) {
    console.error('Error translating text with Gemini:', error);
    return text; // Return original text if translation fails
  }
};

// Function to detect language
exports.detectLanguage = async (text) => {
  try {
    const prompt = `Detect the language of this text and respond with only the language code from this list: en, hi, mr, te, ta, gu, pa, bn. Don't explain.\n\nText: "${text}"`;
    
    const response = await exports.generateContent(prompt);
    const langCode = response.trim().toLowerCase();
    
    // Verify it's a supported language
    const supportedCodes = ['en', 'hi', 'mr', 'te', 'ta', 'gu', 'pa', 'bn'];
    return supportedCodes.includes(langCode) ? langCode : 'en';
  } catch (error) {
    console.error('Error detecting language with Gemini:', error);
    return 'en'; // Default to English
  }
};

// Helper function to get language name from code
function getLangName(code) {
  const languages = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi',
    'te': 'Telugu',
    'ta': 'Tamil',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'bn': 'Bengali'
  };
  return languages[code] || 'English';
} 