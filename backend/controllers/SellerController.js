import Property from '../models/Property.js';

export const addProperty = async (req, res) => {
    const { 
        title, 
        description, 
        price, 
        location,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities 
    } = req.body;
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
            image: imageBase64,
            propertyType,
            bedrooms,
            bathrooms,
            area,
            amenities: amenities ? amenities.split(',') : []
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

export const getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ seller: req.user.id })
            .select('title location price propertyType status createdAt image')
            .sort({ createdAt: -1 });

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch properties' });
    }
};

export const getPropertyDetails = async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.propertyId,
            seller: req.user.id
        });

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch property details' });
    }
};

export const updatePropertyStatus = async (req, res) => {
    try {
        const { propertyId, status } = req.body;
        const property = await Property.findOneAndUpdate(
            { _id: propertyId, seller: req.user.id },
            { status },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update property status' });
    }
};