import express from 'express';
import { viewProperties } from '../controllers/BuyerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';

const router = express.Router();

router.get('/properties', verifyJWT, roleCheck(['buyer']), viewProperties);

export default router;
