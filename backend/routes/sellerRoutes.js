import express from 'express';
import * as sellerController from '../controllers/SellerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/myProperty', verifyJWT, roleCheck(['seller']), sellerController.myProperties);
router.get('/property/:propertyId', verifyJWT, roleCheck(['seller']), sellerController.getPropertyDetails);
router.post('/property', verifyJWT, roleCheck(['seller']), upload.single('image'), sellerController.addProperty);
router.post('/delete-property', verifyJWT, roleCheck(['seller']), sellerController.deleteProperty);
router.patch('/property/status', verifyJWT, roleCheck(['seller']), sellerController.updatePropertyStatus);
router.post('/advertise', verifyJWT, roleCheck(['seller']), sellerController.advertiseProperty);

export default router;