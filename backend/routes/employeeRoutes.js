import express from 'express';
import { addAdvertisement ,deleteAdvertisement} from '../controllers/EmployeeController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.post('/advertisement', verifyJWT, roleCheck(['employee']), upload.single('image'), addAdvertisement);
router.post('/delete-advertisement', verifyJWT, roleCheck(['employee']), deleteAdvertisement);

export default router;