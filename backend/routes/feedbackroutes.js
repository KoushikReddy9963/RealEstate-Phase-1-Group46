import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// POST route to create feedback
router.post('/', async (req, res) => {
    try {
        console.log('Received feedback data:', req.body); // Debug log
        
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and message'
            });
        }

        // Create new feedback
        const feedback = new Feedback({
            name,
            email,
            message
        });

        // Save feedback to database
        await feedback.save();
        
        console.log('Feedback saved:', feedback); // Debug log

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully!',
            feedback
        });

    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message
        });
    }
});

export default router;