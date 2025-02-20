import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import events from 'events';

// Increase the limit of event listeners
events.EventEmitter.defaultMaxListeners = 15;

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Clean up resources when the server is shutting down
const cleanup = () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
};

// Handle cleanup for different termination signals
process.once('SIGINT', cleanup);
process.once('SIGTERM', cleanup);
process.once('SIGUSR2', cleanup);

// Import routes
import userRoutes from './routes/userRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import advertisementRoutes from './routes/AdvertisementRoutes.js';
import feedbackroutes from './routes/feedbackroutes.js';

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/adv', advertisementRoutes);
app.use('/api/feedback', feedbackroutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
