import Advertisement from '../models/Advertisement.js';
import AdvertisementRequest from '../models/AdvertisementRequest.js';
import Property from '../models/Property.js';

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

// Add edit advertisement controller
export const editAdvertisement = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const { file } = req;

    try {
        const advertisement = await Advertisement.findById(id);
        
        if (!advertisement) {
            return res.status(404).json({ message: 'Advertisement not found' });
        }

        // Update the title
        advertisement.title = title;

        // Update the image only if a new file is uploaded
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
    const { id } = req.params;  // Changed from req.body to req.params
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

// Add get all advertisements controller
export const getAdvertisements = async (req, res) => {
    try {
        const advertisements = await Advertisement.find({ employee: req.user.id });
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch advertisements' });
    }
};

// Add new method to get advertisement requests
export const getAdvertisementRequests = async (req, res) => {
    try {
        const requests = await AdvertisementRequest.find()
            .populate('seller', 'email')
            .populate('property', 'title image')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Failed to fetch advertisement requests:', error);
        res.status(500).json({ message: 'Failed to fetch advertisement requests' });
    }
};

// Update advertisement request status
export const updateAdvertisementRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        const request = await AdvertisementRequest.findById(requestId)
            .populate('property', 'title image')
            .populate('seller', 'email');
        
        if (!request) {
            return res.status(404).json({ message: 'Advertisement request not found' });
        }

        request.status = status;
        await request.save();

        if (status === 'approved') {
            const property = request.property;
            if (!property || !property.title || !property.image) {
                return res.status(400).json({ message: 'Property details are incomplete' });
            }

            await Property.findByIdAndUpdate(
                property._id,
                { 
                    isAdvertised: true,
                    advertisementDate: new Date()
                }
            );

            // Create a new advertisement
            await Advertisement.create({
                employee: req.user.id,
                title: property.title,
                content: property.image,
                propertyId: property._id,
                sellerId: request.seller._id,
                status: 'active',
                createdAt: new Date()
            });
        } else if (status === 'rejected') {
            await Property.findByIdAndUpdate(
                request.property,
                { 
                    isAdvertised: false,
                    advertisementDate: null
                }
            );
        }

        res.status(200).json({ 
            message: `Advertisement request ${status} successfully`,
            request: request
        });
    } catch (error) {
        console.error('Failed to update advertisement request:', error);
        res.status(500).json({ message: 'Failed to update advertisement request' });
    }
};

// Get all approved advertisements
export const getApprovedAdvertisements = async (req, res) => {
    try {
        const approvedAds = await AdvertisementRequest.find({ status: 'approved' })
            .populate('property')
            .populate('seller', 'email')
            .sort({ advertisementDate: -1 });

        res.status(200).json(approvedAds);
    } catch (error) {
        console.error('Failed to fetch approved advertisements:', error);
        res.status(500).json({ message: 'Failed to fetch approved advertisements' });
    }
};

// Delete advertisement request
export const deleteAdvertisementRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        
        const request = await AdvertisementRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Advertisement request not found' });
        }

        // Update the property's advertisement status
        await Property.findByIdAndUpdate(
            request.property,
            { 
                isAdvertised: false,
                advertisementDate: null
            }
        );

        // Delete the request
        await AdvertisementRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: 'Advertisement request deleted successfully' });
    } catch (error) {
        console.error('Failed to delete advertisement request:', error);
        res.status(500).json({ message: 'Failed to delete advertisement request' });
    }
};