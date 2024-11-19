import express from 'express';
import { getDashboardStats, deleteUser } from '../controllers/AdminController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import { deleteFeedback } from '../controllers/FeedbackController.js';

const router = express.Router();

router.get('/dashboard-stats', verifyJWT, roleCheck(['admin']), getDashboardStats);
router.delete('/users/:id', verifyJWT, roleCheck(['admin']), deleteUser);
router.delete('/feedback/:id', verifyJWT, roleCheck(['admin']), deleteFeedback);

export default router;