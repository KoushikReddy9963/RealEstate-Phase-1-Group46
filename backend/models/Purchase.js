import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model('Purchase', purchaseSchema); 