import Feedback from '../models/Feedback.js';

export const addFeedback = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        res.status(201).json({ success: true, message: 'Feedback added successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to add feedback' });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};



export const deleteFeedback = async (req, res) => {
    const { id } = req.body;
    try {
        await Feedback.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Failed to delete feedback'});
    }
};