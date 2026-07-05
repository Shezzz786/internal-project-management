const { getRedisClient } = require('../config/redis');

const redisCache = (duration) => {
  return async (req, res, next) => {
    const redisClient = getRedisClient();
    
    // If Redis is not connected, just skip caching
    if (!redisClient) {
      return next();
    }

    // Use user ID and URL for a unique cache key per user
    const key = `cache:${req.user.id}:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        console.log(`Cache Hit for ${key}`);
        return res.json(JSON.parse(cachedData));
      }

      // Intercept the res.json method to save the data in Redis before sending
      const originalSend = res.json;
      res.json = function (data) {
        console.log(`Cache Miss for ${key}. Saving to Redis.`);
        redisClient.setEx(key, duration, JSON.stringify(data));
        originalSend.call(this, data);
      };

      next();
    } catch (err) {
      console.error('Redis Cache Error', err);
      next(); // Fallback to normal flow if Redis fails
    }
  };
};

module.exports = redisCache;
