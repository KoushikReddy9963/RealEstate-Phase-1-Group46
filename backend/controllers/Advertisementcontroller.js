import Advertisement from '../models/Advertisement.js';

export const getAdvertisement = async (req, res) => {
    try {
        const advertisements = await Advertisement.find();
        res.status(200).json(advertisements);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
