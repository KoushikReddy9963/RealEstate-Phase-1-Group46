import Property from '../models/Property.js';

export const viewProperties = async (req, res) => {
    try {
        const properties = await Property.find({});
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties' });
    }
};
