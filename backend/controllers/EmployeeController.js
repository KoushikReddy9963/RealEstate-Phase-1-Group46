import Advertisement from '../models/Advertisement.js';

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