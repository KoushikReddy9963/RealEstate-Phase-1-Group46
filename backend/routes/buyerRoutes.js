import express from 'express';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import * as buyerController from '../controllers/BuyerController.js';
import cacheMiddleware from '../middlewares/cache.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

/**
 * @swagger
 * /buyer/properties:
 *   get:
 *     summary: View available properties
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of properties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/properties', verifyJWT, roleCheck(['buyer']), cacheMiddleware, buyerController.viewProperties);

/**
 * @swagger
 * /buyer/purchased:
 *   get:
 *     summary: Get purchased properties
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchased properties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/purchased', verifyJWT, roleCheck(['buyer']), cacheMiddleware, buyerController.getPurchasedProperties);

/**
 * @swagger
 * /buyer/favorites:
 *   get:
 *     summary: Get favorite properties
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite properties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/favorites', verifyJWT, roleCheck(['buyer']), cacheMiddleware, buyerController.getFavorites);

/**
 * @swagger
 * /buyer/favorites:
 *   post:
 *     summary: Add a property to favorites
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property added to favorites
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/favorites', verifyJWT, roleCheck(['buyer']), async (req, res, next) => {
  try {
    const result = await buyerController.addToFavorites(req, res);
    // Invalidate favorites cache
    await redisClient.del(`/api/buyer/favorites?user=${req.user._id}`);
    console.log('Cache invalidated for favorites');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /buyer/favorites/{propertyId}:
 *   delete:
 *     summary: Remove a property from favorites
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property removed from favorites
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found in favorites
 */
router.delete('/favorites/:propertyId', verifyJWT, roleCheck(['buyer']), async (req, res, next) => {
  try {
    const result = await buyerController.removeFromFavorites(req, res);
    // Invalidate favorites cache
    await redisClient.del(`/api/buyer/favorites?user=${req.user._id}`);
    console.log('Cache invalidated for favorites');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /buyer/purchase:
 *   post:
 *     summary: Purchase a property
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Property purchased successfully
 *       400:
 *         description: Invalid input or insufficient balance
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/purchase', verifyJWT, roleCheck(['buyer']), async (req, res, next) => {
  try {
    const result = await buyerController.purchaseProperty(req, res);
    // Invalidate properties and purchased caches
    const cacheKeys = [
      '/api/buyer/properties',
      `/api/buyer/purchased?user=${req.user._id}`,
      `/api/buyer/purchases?user=${req.user._id}`
    ];
    for (const key of cacheKeys) {
      await redisClient.del(key);
      console.log(`Cache invalidated for ${key}`);
    }
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /buyer/webhook:
 *   post:
 *     summary: Stripe webhook for payment events
 *     tags: [Buyer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 *       400:
 *         description: Invalid webhook event
 */
router.post('/webhook', express.raw({ type: 'application/json' }), buyerController.handleStripeWebhook);

/**
 * @swagger
 * /buyer/purchased-properties:
 *   get:
 *     summary: Get all purchased properties
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchased properties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/purchased-properties', verifyJWT, roleCheck(['buyer']), cacheMiddleware, buyerController.getPurchasedProperties);

/**
 * @swagger
 * /buyer/purchases:
 *   get:
 *     summary: Get purchase history
 *     tags: [Buyer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/purchases', verifyJWT, roleCheck(['buyer']), cacheMiddleware, buyerController.getPurchaseHistory);

export default router;