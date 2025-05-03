import express from 'express';
import { getDashboardStats, deleteUser, addEmployee, deleteProperty, deleteFeedback } from '../controllers/AdminController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import cacheMiddleware from '../middlewares/cache.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

/**
 * @swagger
 * /admin/dashboard-stats:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/dashboard-stats', verifyJWT, roleCheck(['admin']), cacheMiddleware, getDashboardStats);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', verifyJWT, roleCheck(['admin']), async (req, res, next) => {
  try {
    const result = await deleteUser(req, res);
    // Invalidate dashboard stats cache
    await redisClient.del('/api/admin/dashboard-stats');
    console.log('Cache invalidated for dashboard-stats');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/feedback/{id}:
 *   delete:
 *     summary: Delete feedback by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Feedback not found
 */
router.delete('/feedback/:id', verifyJWT, roleCheck(['admin']), async (req, res, next) => {
  try {
    const result = await deleteFeedback(req, res);
    // Invalidate dashboard stats cache
    await redisClient.del('/api/admin/dashboard-stats');
    console.log('Cache invalidated for dashboard-stats');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/add-employee:
 *   post:
 *     summary: Add a new employee
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Employee added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/add-employee', verifyJWT, roleCheck(['admin']), async (req, res, next) => {
  try {
    const result = await addEmployee(req, res);
    // Invalidate dashboard stats cache
    await redisClient.del('/api/admin/dashboard-stats');
    console.log('Cache invalidated for dashboard-stats');
    return result;
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /admin/properties/{id}:
 *   delete:
 *     summary: Delete a property by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Property not found
 */
router.delete('/properties/:id', verifyJWT, roleCheck(['admin']), async (req, res, next) => {
  try {
    const result = await deleteProperty(req, res);
    // Invalidate dashboard stats and properties cache
    const cacheKeys = [
      '/api/admin/dashboard-stats',
      '/api/buyer/properties'
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

export default router;