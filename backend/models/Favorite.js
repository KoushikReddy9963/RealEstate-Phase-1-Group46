import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure a user can't favorite the same property twice
favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;