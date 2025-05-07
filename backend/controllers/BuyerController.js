import Property from '../models/Property.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import Favorite from '../models/Favorite.js';
import redisClient from '../utils/redis.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_KEY);

export const purchaseProperty = async (req, res) => {
    try {
        const { propertyId, price, title } = req.body;
        const userId = req.user.id;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        if (property.status !== 'available') {
            return res.status(400).json({ message: 'Property is not available for purchase' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: title,
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/payment-success',
            cancel_url: 'http://localhost:3000/payment-cancel',
            metadata: {
                propertyId: propertyId,
                buyerId: userId
            }
        });

        const purchase = new Purchase({
            property: propertyId,
            buyer: userId,
            seller: property.seller,
            amount: price,
            status: 'completed',
            stripeSessionId: session.id,
            purchaseDate: new Date()
        });
        await purchase.save();

        property.status = 'sold';
        await property.save();

        res.json({
            paymentUrl: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Purchase initiation failed:', error);
        res.status(500).json({ message: 'Failed to initiate purchase' });
    }
};

export const viewProperties = async (req, res) => {
    try {
        const start = Date.now();
        const {
            minPrice,
            maxPrice,
            propertyType,
            location,
            minBedrooms,
            minBathrooms,
            minArea,
            maxArea,
            title // <-- Add title from query
        } = req.query;

        let filter = { status: 'available' };

        if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
        if (propertyType) filter.propertyType = propertyType;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (title) filter.title = { $regex: title, $options: 'i' };
        if (minBedrooms) filter.bedrooms = { $gte: Number(minBedrooms) };
        if (minBathrooms) filter.bathrooms = { $gte: Number(minBathrooms) };
        if (minArea) filter.area = { $gte: Number(minArea) };
        if (maxArea) filter.area = { $lte: Number(maxArea) };

        const properties = await Property.find(filter)
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        const duration = Date.now() - start;
        console.log(`MongoDB query for viewProperties took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(properties));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties' });
    }
};

export const getPurchasedProperties = async (req, res) => {
    try {
        const start = Date.now();
        const purchases = await Purchase.find({ buyer: req.user.id })
            .populate({
                path: 'property',
                select: 'title location price image description userEmail createdAt status propertyType bedrooms bathrooms area amenities'
            });

        const purchasedProperties = purchases.map(purchase => ({
            ...purchase.property._doc,
            purchaseDate: purchase.purchaseDate,
            amount: purchase.amount
        }));

        const duration = Date.now() - start;
        console.log(`MongoDB query for getPurchasedProperties took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(purchasedProperties));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(purchasedProperties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch purchased properties' });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.id;

        const existingFavorite = await Favorite.findOne({ userId, propertyId });

        if (existingFavorite) {
            await Favorite.findByIdAndDelete(existingFavorite._id);
            res.status(200).json({ message: 'Removed from favorites' });
        } else {
            const newFavorite = new Favorite({ userId, propertyId });
            await newFavorite.save();
            res.status(201).json({ message: 'Added to favorites' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to update favorites' });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const start = Date.now();
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate({
                path: 'propertyId',
                select: 'title location price image description userEmail createdAt status propertyType bedrooms bathrooms area amenities'
            })
            .sort({ createdAt: -1 });

        const favoriteProperties = favorites.map(fav => fav.propertyId);
        const duration = Date.now() - start;
        console.log(`MongoDB query for getFavorites took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(favoriteProperties));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(favoriteProperties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch favorites' });
    }
};

export const addToFavorites = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user.id;

        const existingFavorite = await Favorite.findOne({ userId, propertyId });

        if (existingFavorite) {
            return res.status(400).json({ message: 'Property already in favorites' });
        }

        const newFavorite = new Favorite({ userId, propertyId });
        await newFavorite.save();
        res.status(201).json({ message: 'Added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to favorites' });
    }
};

export const removeFromFavorites = async (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const userId = req.user.id;

        const result = await Favorite.findOneAndDelete({ userId, propertyId });

        if (!result) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        res.status(200).json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove from favorites' });
    }
};

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        try {
            const purchase = await Purchase.findOne({ stripeSessionId: session.id });
            if (purchase) {
                purchase.status = 'completed';
                purchase.transactionId = session.payment_intent;
                await purchase.save();

                const property = await Property.findById(purchase.property);
                if (property) {
                    property.status = 'sold';
                    await property.save();
                }
            }
        } catch (error) {
            console.error('Error processing successful payment:', error);
            return res.status(500).json({ message: 'Error processing payment' });
        }
    }

    res.json({ received: true });
};

export const getPurchaseHistory = async (req, res) => {
    try {
        const start = Date.now();
        const purchases = await Purchase.find({ buyer: req.user.id })
            .populate('property')
            .populate('seller', 'name email')
            .sort({ purchaseDate: -1 });

        const duration = Date.now() - start;
        console.log(`MongoDB query for getPurchaseHistory took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(purchases));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(purchases);
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Failed to fetch purchase history' });
    }
};