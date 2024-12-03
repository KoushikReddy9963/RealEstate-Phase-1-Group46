import Property from '../models/Property.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const { id } = req.body;
    try {
        await Property.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete property' });
    }
}

export const myProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user.id });
        res.status(200).json(properties);
        console.log
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch properties' });
    }
}

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
        const property = await Property.findOneAndUpdate(
            { _id: propertyId, seller: req.user.id },
            { status },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update property status' });
    }
};

export const advertiseProperty = async (req, res) => {
    try {
        const { amount, currency, product, propertyId } = req.body;
        const userId = req.user.id;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency || 'inr',
                    product_data: {
                        name: `Advertisement: ${product}`,
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
                sellerId: userId,
                type: 'advertisement'
            }
        });

        // Update property advertisement status
        await Property.findOneAndUpdate(
            { _id: propertyId, seller: userId },
            { 
                isAdvertised: true,
                advertisementDate: new Date(),
                stripeSessionId: session.id
            }
        );

        res.json({
            paymentUrl: session.url,
            flag: session.id
        });
    } catch (error) {
        console.error('Advertisement payment failed:', error);
        res.status(500).json({ message: 'Failed to initiate advertisement payment' });
    }
};