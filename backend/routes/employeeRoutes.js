import express from 'express';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import {
  getAdvertisements,
  addAdvertisement,
  editAdvertisement,
  deleteAdvertisement,
  getAdvertisementRequests,
  updateAdvertisementRequest,
  deleteAdvertisementRequest,
  getApprovedAdvertisements,
  getRevenueStats
} from '../controllers/EmployeeController.js';
import cacheMiddleware from '../middlewares/cache.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

/**
 * @swagger
 * /employee/advertisements:
 *   get:
 *     summary: Get all advertisements
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of advertisements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/advertisements', verifyJWT, roleCheck(['employee']), cacheMiddleware, getAdvertisements);

/**
 * @swagger
 * /employee/advertisement:
 *   post:
 *     summary: Add a new advertisement
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Advertisement added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/advertisement', verifyJWT, roleCheck(['employee']), async (req, res, next) => {
  try {
    const result = await addAdvertisement(req, res);
    // Invalidate advertisements cache
    await redisClient.del('/api/employee/advertisements');
    console.log('Cache invalidated for advertisements');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /employee/revenue-stats:
 *   get:
 *     summary: Get revenue statistics
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue stats retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/revenue-stats', verifyJWT, roleCheck(['employee']), cacheMiddleware, getRevenueStats);

/**
 * @swagger
 * /employee/advertisement/{id}:
 *   put:
 *     summary: Edit an advertisement
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Advertisement not found
 */
router.put('/advertisement/:id', verifyJWT, roleCheck(['employee']), async (req, res, next) => {
  try {
    const result = await editAdvertisement(req, res);
    // Invalidate advertisements cache
    await redisClient.del('/api/employee/advertisements');
    console.log('Cache invalidated for advertisements');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /employee/advertisement/{id}:
 *   delete:
 *     summary: Delete an advertisement
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement ID
 *     responses:
 *       200:
 *         description: Advertisement deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Advertisement not found
 */
router.delete('/advertisement/:id', verifyJWT, roleCheck(['employee']), async (req, res, next) => {
  try {
    const result = await deleteAdvertisement(req, res);
    // Invalidate advertisements cache
    await redisClient.del('/api/employee/advertisements');
    console.log('Cache invalidated for advertisements');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /employee/advertisement-requests:
 *   get:
 *     summary: Get all advertisement requests
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of advertisement requests retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/advertisement-requests', verifyJWT, roleCheck(['employee']), cacheMiddleware, getAdvertisementRequests);

/**
 * @swagger
 * /employee/advertisement-request/status:
 *   patch:
 *     summary: Update advertisement request status
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, pending]
 *     responses:
 *       200:
 *         description: Advertisement request status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Advertisement request not found
 */
router.patch('/advertisement-request/status', verifyJWT, roleCheck(['employee']), async (req, res, next) => {
  try {
    const result = await updateAdvertisementRequest(req, res);
    // Invalidate advertisement requests cache
    await redisClient.del('/api/employee/advertisement-requests');
    console.log('Cache invalidated for advertisement-requests');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /employee/advertisement-request/{id}:
 *   delete:
 *     summary: Delete an advertisement request
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Advertisement request ID
 *     responses:
 *       200:
 *         description: Advertisement request deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Advertisement request not found
 */
router.delete('/advertisement-request/:id', verifyJWT, roleCheck(['employee']), async (req, res, next) => {
  try {
    const result = await deleteAdvertisementRequest(req, res);
    // Invalidate advertisement requests cache
    await redisClient.del('/api/employee/advertisement-requests');
    console.log('Cache invalidated for advertisement-requests');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /employee/approved-advertisements:
 *   get:
 *     summary: Get all approved advertisements
 *     tags: [Employee]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved advertisements retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/approved-advertisements', verifyJWT, roleCheck(['employee']), cacheMiddleware, getApprovedAdvertisements);

export default router;