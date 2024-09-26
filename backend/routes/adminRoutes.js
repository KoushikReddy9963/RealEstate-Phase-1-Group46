import express from 'express';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import { getAdminDashboardData, deleteUser } from '../controllers/AdminController.js';
import { deleteFeedback } from '../controllers/FeedbackController.js';

const router = express.Router();

router.get('/', verifyJWT, roleCheck(['admin']), getAdminDashboardData);
router.post('/delete-feedback', verifyJWT, roleCheck(['admin']), deleteFeedback);
router.delete('/delete-user/:id', verifyJWT, roleCheck(['admin']), deleteUser);

export default router;