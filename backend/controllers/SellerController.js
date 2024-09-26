import Property from '../models/Property.js';

export const addProperty = async (req, res) => {
    const { title, description, price, location } = req.body;
    const { file } = req;

    try {
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageBase64 = file.buffer.toString('base64');
        const userEmail = req.user.email;

        const newProperty = await Property.create({
            seller: req.user.id,
            userEmail,
            title,
            location,
            description,
            price,
            image: imageBase64
        });

        res.status(201).json(newProperty);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to add property' });
    }
};

export const deleteProperty = async (req, res) => {
    const { id } = req.body;
    try {
        await Property.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete property' });
    }
}

export const myProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user.id });
        res.status(200).json(properties);
        console.log
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to fetch properties' });
    }
}