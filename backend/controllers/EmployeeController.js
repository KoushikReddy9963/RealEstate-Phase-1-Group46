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

export const deleteAdvertisement = async (req, res) => {
    const { id } = req.body;
    try {
        await Advertisement.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Advertisement deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete advertisement' });
    }    
};