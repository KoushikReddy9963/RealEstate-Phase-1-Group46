import redisClient from '../utils/redis.js';

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;
  console.log(`Checking cache for key: ${cacheKey}`);
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }
    console.log(`Cache miss for ${cacheKey}`);
    req.cacheKey = cacheKey;
    next();
  } catch (err) {
    console.error(`Cache error for ${cacheKey}:`, err.message);
    next(); // Fallback to MongoDB
  }
};

export default cacheMiddleware;