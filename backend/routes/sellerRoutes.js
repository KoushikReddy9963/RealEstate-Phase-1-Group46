import express from 'express';
import { addProperty ,deleteProperty} from '../controllers/SellerController.js';
import { myProperties } from '../controllers/SellerController.js';
import { verifyJWT, roleCheck } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/myProperty', verifyJWT, roleCheck(['seller']), myProperties);
router.post('/property', verifyJWT, roleCheck(['seller']), upload.single('image'), addProperty);
router.post('/delete-property', verifyJWT, roleCheck(['seller']), deleteProperty);

export default router;