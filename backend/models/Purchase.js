import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    }
});

export default mongoose.model('Purchase', purchaseSchema); 