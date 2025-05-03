import express from 'express';
import { addFeedback } from '../controllers/FeedbackController.js';

const router = express.Router();

router.post('/',addFeedback);

export default router;