import Property from '../models/Property.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import AdvertisementRequest from '../models/AdvertisementRequest.js';
import redisClient from '../utils/redis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const addProperty = async (req, res) => {
    const { 
        title, 
        description, 
        price, 
        location,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities 
    } = req.body;
    const { file } = req;
    console.log(file);

    try {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageBase64 = file.buffer.toString('base64');
        const userEmail = req.user.email;

        const newProperty = await Property.create({
            seller: req.user.id,
            userEmail,
            title,
            location,
            description,
            price,
            image: imageBase64,
            propertyType,
            bedrooms,
            bathrooms,
            area,
            amenities: amenities ? amenities.split(',') : []
        });

        res.status(201).json(newProperty);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add property' });
    }
};

export const deleteProperty = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        if (property.status === 'sold' || property.status === 'pending') {
            return res.status(400).json({ 
                message: 'Cannot delete sold or pending properties' 
            });
        }

        await Property.findByIdAndDelete(propertyId);
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete property' });
    }
};

export const myProperties = async (req, res) => {
    try {
        const start = Date.now();
        const properties = await Property.find({ seller: req.user.id });
        const duration = Date.now() - start;
        console.log(`MongoDB query for myProperties took ${duration}ms`);
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
        res.status(400).json({ success: false, message: 'Failed to fetch properties' });
    }
};

export const advertiseProperty = async (req, res) => {
    try {
        const { amount, currency, title, image, propertyId } = req.body;
        const userId = req.user.id;
        const property = await Property.findOne({ _id: propertyId, seller: userId });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency || 'inr',
                    product_data: {
                        name: `Advertisement: ${property.title}`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${FRONTEND_URL}/payment-success`,
            cancel_url: `${FRONTEND_URL}/payment-cancel`,
            metadata: {
                propertyId: propertyId.toString(),
                sellerId: userId.toString(),
                type: 'advertisement'
            }
        });

        const advertisementRequest = new AdvertisementRequest({
            property: propertyId,
            seller: userId,
            amount: amount / 100,
            status: 'pending',
            stripeSessionId: session.id,
            title: property.title,
            image: property.image,
            description: property.description || 'Property Advertisement'
        });

        await advertisementRequest.save();

        res.json({
            paymentUrl: session.url,
            requestId: advertisementRequest._id
        });
    } catch (error) {
        console.error('Advertisement payment failed:', error);
        res.status(500).json({ 
            message: 'Failed to initiate advertisement payment',
            error: error.message 
        });
    }
};

export const getAdvertisementStatus = async (req, res) => {
    try {
        const start = Date.now();
        const advertisements = await AdvertisementRequest.find({
            seller: req.user.id
        })
        .sort({ createdAt: -1 })
        .lean();
        const latestRequests = {};
        for (const ad of advertisements) {
            const propId = ad.property?.toString() || ad.propertyId?.toString();
            if (propId && !latestRequests[propId]) {
                latestRequests[propId] = {
                    property: propId,
                    status: ad.status,
                    _id: ad._id,
                    createdAt: ad.createdAt,
                };
            }
        }
        const duration = Date.now() - start;
        console.log(`MongoDB query for getAdvertisementStatus took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(Object.values(latestRequests)));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(Object.values(latestRequests));
    } catch (error) {
        console.error('Failed to fetch advertisement status:', error);
        res.status(500).json({ message: 'Failed to fetch advertisement status' });
    }
};