import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true, validate: {
        validator: async function(v) {
            const property = await mongoose.model('Property').findById(v);
            return property !== null;
        },
        message: props => `Property with ID ${props.value} does not exist!`
    }},
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Add an index for better query performance
advertisementSchema.index({ property: 1 });

// Add a pre-save middleware to check if the property exists
advertisementSchema.pre('save', async function(next) {
    try {
        const property = await mongoose.model('Property').findById(this.property);
        if (!property) {
            throw new Error(`Property with ID ${this.property} does not exist`);
        }
        next();
    } catch (error) {
        next(error);
    }
});

export default mongoose.model('Advertisement', advertisementSchema);
