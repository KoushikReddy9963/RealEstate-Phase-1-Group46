import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
