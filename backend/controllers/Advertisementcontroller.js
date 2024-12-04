import Advertisement from '../models/Advertisement.js';

export const getAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.find()
            .populate({
                path: 'property',
                select: 'title description price location propertyType status area bedrooms bathrooms amenities image'
            })
            .populate('employee', 'name email')
            .sort({ createdAt: -1 });

        console.log('Fetched advertisements:', JSON.stringify(advertisements, null, 2));
        
        const validAdvertisements = advertisements.filter(ad => {
            if (!ad.property) {
                console.warn(`Advertisement ${ad._id} has no populated property`);
                return false;
            }
            return true;
        });

        res.status(200).json(validAdvertisements);
    } catch (error) {
        console.error('Error in getAdvertisements:', error);
        res.status(500).json({ 
            message: "Error fetching advertisements",
            error: error.message
        });
    }
};