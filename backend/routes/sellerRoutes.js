import express from 'express';
import {
    myProperties,
    getPropertyDetails,
    addProperty,
    deleteProperty,
    updatePropertyStatus,
    advertiseProperty,
    getMyProperties,
    getAdvertisementStatus
} from '../controllers/SellerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Property Management Routes
router.get('/myProperty', verifyJWT, roleCheck(['seller']), myProperties);
router.get('/property/:propertyId', verifyJWT, roleCheck(['seller']), getPropertyDetails);
router.post('/property', verifyJWT, roleCheck(['seller']), upload.single('image'), addProperty);
router.post('/delete-property', verifyJWT, roleCheck(['seller']), deleteProperty);
router.patch('/property/status', verifyJWT, roleCheck(['seller']), updatePropertyStatus);

// Advertisement Management Routes
router.post('/advertise', verifyJWT, roleCheck(['seller']), advertiseProperty);
router.get('/advertisement-status', verifyJWT, roleCheck(['seller']), getAdvertisementStatus);

// Purchase Routes
router.get('/my-properties', verifyJWT, roleCheck(['seller']), getMyProperties);

export default router;