import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { 
        type: String, 
        required: true,
        enum: ['house', 'apartment', 'villa', 'land']
    },
    status: { 
        type: String, 
        default: 'available',
        enum: ['available', 'sold', 'pending']
    },
    area: { type: Number, required: true },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    amenities: [{ type: String }],
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    image: { 
        type: String,
        default: 'https://via.placeholder.com/400x300?text=No+Image+Available'
    },
    createdAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
propertySchema.index({ price: 1 });
propertySchema.index({ location: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ propertyType: 1 });

export default mongoose.model('Property', propertySchema);
