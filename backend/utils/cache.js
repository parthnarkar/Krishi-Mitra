const redis = require('redis');

const client = redis.createClient({
  // For local development, you might use default settings.
  // For production, use process.env.REDIS_URL after configuring your Redis server.
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

// Connect to Redis
client.connect().then(() => {
  console.log('✅ Connected to Redis');
}).catch((err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = client;
