import Advertisement from '../models/Advertisement.js';

export const getAdvertisement = async (req, res) => {
    try {
        const advertisements = await Advertisement.find()
            .populate({
                path: 'property',
                match: { status: 'available' },
                select: 'title description price location bedrooms bathrooms area propertyType image status createdAt',
                populate: {
                    path: 'seller',
                    select: 'name email'
                }
            });

        const activeAdvertisements = advertisements.filter(ad => ad.property !== null);
        
        const uniqueAdvertisements = new Map();
        activeAdvertisements.forEach(ad => {
            if (ad.property && !uniqueAdvertisements.has(ad.property._id.toString())) {
                uniqueAdvertisements.set(ad.property._id.toString(), ad);
            }
        });
        
        res.status(200).json(Array.from(uniqueAdvertisements.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
