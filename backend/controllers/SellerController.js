import Property from '../models/Property.js';
import Purchase from '../models/Purchase.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import AdvertisementRequest from '../models/AdvertisementRequest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_KEY);

// Define the frontend URL explicitly
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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
            success_url: `${FRONTEND_URL}/payment-success`,
            cancel_url: `${FRONTEND_URL}/payment-cancel`,
            metadata: {
                propertyId: propertyId.toString(),
                buyerId: userId.toString()
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

        // Check if the property belongs to the seller
        if (property.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this property' });
        }

        // Prevent deletion if property is sold or pending
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
        const properties = await Property.find({ seller: req.user.id });
        res.status(200).json(properties);
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch properties' });
    }
};

export const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user.id })
            .select('title location price propertyType status createdAt image')
            .sort({ createdAt: -1 });

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties' });
    }
};

export const getPropertyDetails = async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.propertyId,
            seller: req.user.id
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch property details' });
    }
};

export const updatePropertyStatus = async (req, res) => {
    try {
        const { propertyId, status } = req.body;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if the property belongs to the seller
        if (property.seller.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this property' });
        }

        // Prevent manual status changes if property is sold or pending
        if (property.status === 'sold' || property.status === 'pending') {
            return res.status(400).json({ 
                message: 'Cannot update status of sold or pending properties' 
            });
        }

        property.status = status;
        await property.save();

        res.status(200).json({ message: 'Property status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update property status' });
    }
};

export const advertiseProperty = async (req, res) => {
    try {
        const { amount, currency, title, image, propertyId } = req.body;
        const userId = req.user.id;

        // First, verify the property exists and get its details
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

        // Create a new advertisement request with all required fields
        const advertisementRequest = new AdvertisementRequest({
            property: propertyId,
            seller: userId,
            amount: amount / 100,
            status: 'pending',
            stripeSessionId: session.id,
            title: property.title,        // Use property title
            image: property.image,        // Use property image
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
        const advertisements = await AdvertisementRequest.find({
            seller: req.user.id
        }).select('propertyId status');
        
        res.status(200).json(advertisements);
    } catch (error) {
        console.error('Failed to fetch advertisement status:', error);
        res.status(500).json({ message: 'Failed to fetch advertisement status' });
    }
};