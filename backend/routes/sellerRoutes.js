import express from 'express';
import { addProperty, deleteProperty, myProperties, updatePropertyStatus, getPropertyDetails } from '../controllers/SellerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/myProperty', verifyJWT, roleCheck(['seller']), myProperties);
router.get('/property/:propertyId', verifyJWT, roleCheck(['seller']), getPropertyDetails);
router.post('/property', verifyJWT, roleCheck(['seller']), upload.single('image'), addProperty);
router.post('/delete-property', verifyJWT, roleCheck(['seller']), deleteProperty);
router.patch('/property/status', verifyJWT, roleCheck(['seller']), updatePropertyStatus);

export default router;