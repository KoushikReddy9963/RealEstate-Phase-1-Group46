import express from 'express';
import { getAdvertisement } from '../controllers/Advertisementcontroller.js';
import cacheMiddleware from '../middlewares/cache.js';

const router = express.Router();

/**
 * @swagger
 * /Advertisement:
 *   get:
 *     summary: Get all advertisements
 *     tags: [Advertisement]
 *     responses:
 *       200:
 *         description: List of advertisements retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/Advertisement', cacheMiddleware, getAdvertisement);

export default router;