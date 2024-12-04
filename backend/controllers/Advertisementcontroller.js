import Advertisement from '../models/Advertisement.js';
import Property from '../models/Property.js';

export const getAdvertisement = async (req, res) => {
    try {
        // Get advertisements and populate with available properties
        const advertisements = await Advertisement.find()
            .populate({
                path: 'property',
                match: { status: 'available' }, // Only get available properties
                select: 'title description price location bedrooms bathrooms area propertyType image status createdAt',
                populate: {
                    path: 'seller',
                    select: 'name email'
                }
            });

        // Filter out advertisements where property is null (not available)
        const activeAdvertisements = advertisements.filter(ad => ad.property !== null);
        
        res.status(200).json(activeAdvertisements);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
