import express from 'express';
import { 
    addAdvertisement, 
    deleteAdvertisement, 
    editAdvertisement,
    getAdvertisements 
} from '../controllers/EmployeeController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/advertisements', verifyJWT, roleCheck(['employee']), getAdvertisements);
router.post('/advertisement', verifyJWT, roleCheck(['employee']), upload.single('image'), addAdvertisement);
router.put('/advertisement/:id', verifyJWT, roleCheck(['employee']), upload.single('image'), editAdvertisement);
router.delete('/advertisement/:id', verifyJWT, roleCheck(['employee']), deleteAdvertisement);

export default router;