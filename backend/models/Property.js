import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Property', propertySchema);
