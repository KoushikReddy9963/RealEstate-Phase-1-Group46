import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    }]
});

export default mongoose.model('User', userSchema);
