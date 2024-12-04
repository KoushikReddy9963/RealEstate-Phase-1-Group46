import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { 
    timestamps: true 
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
