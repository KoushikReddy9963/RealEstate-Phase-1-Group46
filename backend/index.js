import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import redisClient from './utils/redis.js';
import userRoutes from './routes/userRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import AdvertisementRoutes from './routes/AdvertisementRoutes.js';
import feedbackroutes from './routes/feedbackroutes.js';
import { swaggerUiServe, swaggerUiSetup } from './swagger.js';

dotenv.config();

console.log(process.env.MONGO_URI);  // Should print your MongoDB URI
console.log(process.env.REDIS_URL);  // Should print your Redis URL

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true
  }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api-docs', swaggerUiServe, swaggerUiSetup);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Connect to Redis (already handled in redis.js, but ensure it's ready)
redisClient.on('ready', () => console.log('Redis is ready'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/adv', AdvertisementRoutes);
app.use('/api/feedback', feedbackroutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;