const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    // Connect to Redis if REDIS_URL is provided, otherwise skip gracefully
    if (process.env.REDIS_URL) {
      redisClient = createClient({ url: process.env.REDIS_URL });
      redisClient.on('error', (err) => console.error('Redis Client Error', err));
      await redisClient.connect();
      console.log('Redis Connected');
    } else {
      console.log('REDIS_URL not found. Running without Redis caching.');
    }
  } catch (error) {
    console.error('Redis Connection Failed', error);
  }
};

const getRedisClient = () => redisClient;

module.exports = { connectRedis, getRedisClient };
