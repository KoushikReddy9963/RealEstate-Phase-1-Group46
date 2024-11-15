import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import cors from 'cors';
import AdvertisementRoutes from './routes/AdvertisementRoutes.js';
import feedbackRoutes from './routes/feedbackroutes.js';
import Stripe from 'stripe';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/adv', AdvertisementRoutes);
app.use('/api/feedback', feedbackRoutes);

app.post('/api/seller/payment', async (req, res) => {
    try {
        const { amount, currency, product } = req.body;

        // console.log('amount:', amount);
        // console.log('currency:', currency);
        // console.log('product:', product);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency || 'usd',
                        product_data: { name: product || 'Real Estate Payment' },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/payment-success`,
            cancel_url: `http://localhost:3000/payment-cancel`,

        });
        res.json({ paymentUrl: session.url, flag: true });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
