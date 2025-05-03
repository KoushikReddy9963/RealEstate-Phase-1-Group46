import Advertisement from '../models/Advertisement.js';
import AdvertisementRequest from '../models/AdvertisementRequest.js';
import Property from '../models/Property.js';
import redisClient from '../utils/redis.js';

export const addAdvertisement = async (req, res) => {
    const { title } = req.body;
    const { file } = req;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageBase64 = file.buffer.toString('base64');

    try {
        const newAdvertisement = await Advertisement.create({
            employee: req.user.id,
            title,
            content: imageBase64
        });
        res.status(201).json(newAdvertisement);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add advertisement' });
    }
};

export const editAdvertisement = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { file } = req;

    try {
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        advertisement.title = title;

        if (file) {
            const imageBase64 = file.buffer.toString('base64');
            advertisement.content = imageBase64;
        }

        const updatedAdvertisement = await advertisement.save();
        res.status(200).json(updatedAdvertisement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update advertisement' });
    }
};

export const deleteAdvertisement = async (req, res) => {
    const { id } = req.params; 
    try {
        const deletedAd = await Advertisement.findByIdAndDelete(id);
        if (!deletedAd) {
            return res.status(404).json({ success: false, message: 'Advertisement not found' });
        }
        res.status(200).json({ success: true, message: 'Advertisement deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete advertisement' });
    }    
};

export const getAdvertisements = async (req, res) => {
    try {
        const start = Date.now();
        const advertisements = await Advertisement.find({ employee: req.user.id })
            .populate({
                path: 'property',
                select: 'title description price location bedrooms bathrooms area propertyType image status createdAt',
                populate: {
                    path: 'seller',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 });

        const formattedAds = advertisements.map(ad => ({
            _id: ad._id,
            title: ad.title,
            content: ad.property?.image || ad.content, 
            createdAt: ad.createdAt,
            property: ad.property
        }));

        const duration = Date.now() - start;
        console.log(`MongoDB query for getAdvertisements took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 300, JSON.stringify(formattedAds));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(formattedAds);
    } catch (error) {
        console.error('Failed to fetch advertisements:', error);
        res.status(500).json({ message: 'Failed to fetch advertisements' });
    }
};

export const getAdvertisementRequests = async (req, res) => {
    try {
        const start = Date.now();
        const requests = await AdvertisementRequest.find()
            .populate('seller', 'email')
            .populate('property', 'title image')
            .sort({ createdAt: -1 });

        const duration = Date.now() - start;
        console.log(`MongoDB query for getAdvertisementRequests took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 120, JSON.stringify(requests));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(requests);
    } catch (error) {
        console.error('Failed to fetch advertisement requests:', error);
        res.status(500).json({ message: 'Failed to fetch advertisement requests' });
    }
};

export const updateAdvertisementRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;
        console.log('Received request:', { requestId, status }); 

        if (!requestId || !status) {
            return res.status(400).json({ message: 'Request ID and status are required' });
        }

        const advertisementRequest = await AdvertisementRequest.findById(requestId);
        
        if (!advertisementRequest) {
            return res.status(404).json({ message: 'Advertisement request not found' });
        }

        advertisementRequest.status = status;
        await advertisementRequest.save();

        if (status === 'approved') {
            try {
                const property = await Property.findById(advertisementRequest.property);
                
                if (!property) {
                    return res.status(404).json({ message: 'Property not found' });
                }

                const newAdvertisement = new Advertisement({
                    employee: req.user.id,
                    property: property._id,
                    title: property.title || 'Property Advertisement',
                    content: advertisementRequest.description || property.description
                });

                await newAdvertisement.save();
                console.log('New advertisement created:', newAdvertisement);
            } catch (error) {
                console.error('Error creating advertisement:', error);
                return res.status(500).json({ message: 'Failed to create advertisement' });
            }
        }

        res.status(200).json({ 
            success: true,
            message: `Advertisement request ${status} successfully`,
            advertisementRequest 
        });

    } catch (error) {
        console.error('Failed to update advertisement request:', error);
        res.status(500).json({ 
            message: 'Failed to update advertisement request',
            error: error.message 
        });
    }
};

export const getApprovedAdvertisements = async (req, res) => {
    try {
        const start = Date.now();
        const approvedAds = await AdvertisementRequest.find({ status: 'approved', employee: req.user.id })
            .populate({
                path: 'property',
                select: 'title description price location bedrooms bathrooms area propertyType image status createdAt',
                match: { status: 'available' }, 
                populate: {
                    path: 'seller',
                    select: 'name email'
                }
            })
            .sort({ advertisementDate: -1 });

        const activeApprovedAds = approvedAds.filter(ad => ad.property !== null);

        const duration = Date.now() - start;
        console.log(`MongoDB query for getApprovedAdvertisements took ${duration}ms`);
        if (req.cacheKey) {
            try {
                await redisClient.setEx(req.cacheKey, 300, JSON.stringify(activeApprovedAds));
                console.log(`Cached response for ${req.cacheKey}`);
            } catch (err) {
                console.error(`Failed to cache ${req.cacheKey}:`, err.message);
            }
        }

        res.status(200).json(activeApprovedAds);
    } catch (error) {
        console.error('Failed to fetch approved advertisements:', error);
        res.status(500).json({ message: 'Failed to fetch approved advertisements' });
    }
};

export const deleteAdvertisementRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const request = await AdvertisementRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Advertisement request not found' });
        }

        await Property.findByIdAndUpdate(
            request.property,
            { 
                isAdvertised: false,
                advertisementDate: null
            }
        );

        await AdvertisementRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Advertisement request deleted successfully' });
    } catch (error) {
        console.error('Failed to delete advertisement request:', error);
        res.status(500).json({ message: 'Failed to delete advertisement request' });
    }
};