import Property from '../models/Property.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';
import Favorite from '../models/Favorite.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_KEY);

// Add this after your existing exports
export const purchaseProperty = async (req, res) => {
    try {
        const { amount, currency, product, propertyId } = req.body;
        const userId = req.user.id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: {
                        name: product,
                    },
                    unit_amount: amount,
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
            amount: amount / 100,
            status: 'pending',
            stripeSessionId: session.id
        });
        await purchase.save();

        res.json({
            paymentUrl: session.url,
            flag: session.id
        });
    } catch (error) {
        console.error('Purchase initiation failed:', error);
        res.status(500).json({ message: 'Failed to initiate purchase' });
    }
};

export const viewProperties = async (req, res) => {
    try {
        const {
            minPrice,
            maxPrice,
            location,
            propertyType,
            minBedrooms,
            minBathrooms,
            minArea,
            maxArea,
            amenities
        } = req.query;

        // Build filter object
        const filter = {};

        // Add price filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Add location filter (case-insensitive)
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Add property type filter
        if (propertyType) {
            filter.propertyType = propertyType;
        }

        // Add bedrooms filter
        if (minBedrooms) {
            filter.bedrooms = { $gte: Number(minBedrooms) };
        }

        // Add bathrooms filter
        if (minBathrooms) {
            filter.bathrooms = { $gte: Number(minBathrooms) };
        }

        // Add area filter
        if (minArea || maxArea) {
            filter.area = {};
            if (minArea) filter.area.$gte = Number(minArea);
            if (maxArea) filter.area.$lte = Number(maxArea);
        }

        // Add amenities filter
        if (amenities) {
            const amenitiesArray = amenities.split(',');
            filter.amenities = { $all: amenitiesArray };
        }

        const properties = await Property.find(filter);
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Failed to fetch properties' });
    }
};

export const getPurchasedProperties = async (req, res) => {
    try {
        const purchases = await Purchase.find({ buyer: req.user.id })
            .populate({
                path: 'property',
                select: 'title location price image description userEmail createdAt status'
            })
            .sort({ purchaseDate: -1 });

        res.status(200).json(purchases);
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
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate({
                path: 'propertyId',
                select: 'title location price image description userEmail createdAt status'
            })
            .sort({ createdAt: -1 });

        const favoriteProperties = favorites.map(fav => fav.propertyId);
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
