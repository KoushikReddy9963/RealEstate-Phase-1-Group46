import Feedback from '../models/Feedback.js';

export const addFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    try {
        const newFeedback = new Feedback({ name, email, message });
        await newFeedback.save();
        res.status(201).json({ success: true, message: 'Feedback added successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add feedback', error: error.message });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch feedbacks', error: error.message });
    }
};

export const deleteFeedback = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Feedback ID is required' });
    }

    try {
        const deletedFeedback = await Feedback.findByIdAndDelete(id);
        if (!deletedFeedback) {
            return res.status(404).json({ success: false, message: 'Feedback not found' });
        }
        res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete feedback', error: error.message });
    }
};
