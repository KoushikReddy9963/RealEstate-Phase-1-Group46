import express from 'express';
import {
  myProperties,
  addProperty,
  deleteProperty,
  advertiseProperty,
  getAdvertisementStatus
} from '../controllers/SellerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import cacheMiddleware from '../middlewares/cache.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

/**
 * @swagger
 * /seller/myProperty:
 *   get:
 *     summary: Get all properties of the seller
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's properties retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/myProperty', verifyJWT, roleCheck(['seller']), cacheMiddleware, myProperties);

/**
 * @swagger
 * /seller/property:
 *   post:
 *     summary: Add a new property
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Property added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/property', verifyJWT, roleCheck(['seller']), upload.single("image"), async (req, res, next) => {
  try {
    const result = await addProperty(req, res);
    // Invalidate properties cache
    await redisClient.del(`/api/seller/myProperty?user=${req.user._id}`);
    console.log('Cache invalidated for myProperty');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /seller/delete-property:
 *   post:
 *     summary: Delete a property
 *     tags: [Seller]
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
 *         description: Property deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 */
router.post('/delete-property', verifyJWT, roleCheck(['seller']), async (req, res, next) => {
  try {
    const result = await deleteProperty(req, res);
    // Invalidate properties cache
    await redisClient.del(`/api/seller/myProperty?user=${req.user._id}`);
    console.log('Cache invalidated for myProperty');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /seller/advertise:
 *   post:
 *     summary: Request advertisement for a property
 *     tags: [Seller]
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
 *         description: Advertisement request submitted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/advertise', verifyJWT, roleCheck(['seller']), async (req, res, next) => {
  try {
    const result = await advertiseProperty(req, res);
    // Invalidate advertisement status cache
    await redisClient.del(`/api/seller/advertisement-status?user=${req.user._id}`);
    console.log('Cache invalidated for advertisement-status');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /seller/advertisement-status:
 *   get:
 *     summary: Get advertisement status for seller's properties
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Advertisement status retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/advertisement-status', verifyJWT, roleCheck(['seller']), cacheMiddleware, getAdvertisementStatus);

export default router;