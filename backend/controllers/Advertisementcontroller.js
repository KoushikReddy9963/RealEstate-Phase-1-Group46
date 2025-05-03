import Advertisement from '../models/Advertisement.js';
import redisClient from '../utils/redis.js';

export const getAdvertisement = async (req, res) => {
    try {
        const start = Date.now();
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
        
        const response = Array.from(uniqueAdvertisements.values());
        const duration = Date.now() - start;
        console.log(`MongoDB query for getAdvertisement took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 300, JSON.stringify(response));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};