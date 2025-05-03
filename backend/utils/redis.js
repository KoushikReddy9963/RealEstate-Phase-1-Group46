import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL, // Make sure your REDIS_URL is correct in .env
});

redisClient.on('error', (err) => console.error('Redis connection error:', err));

redisClient.on('ready', () => console.log('Redis is ready'));

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
}

connectRedis();

export default redisClient;
