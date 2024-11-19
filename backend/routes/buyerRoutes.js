import express from 'express';
import { verifyJWT, roleCheck} from '../middlewares/auth.js';
import * as buyerController from '../controllers/BuyerController.js';

const router = express.Router();

router.get('/properties', verifyJWT, roleCheck(['buyer']), buyerController.viewProperties);
router.get('/purchased', verifyJWT, roleCheck(['buyer']), buyerController.getPurchasedProperties);
router.get('/favorites', verifyJWT, roleCheck(['buyer']), buyerController.getFavorites);
router.post('/favorites', verifyJWT, roleCheck(['buyer']), buyerController.addToFavorites);
router.delete('/favorites/:propertyId', verifyJWT, roleCheck(['buyer']), buyerController.removeFromFavorites);
router.post('/purchase', verifyJWT, roleCheck(['buyer']), buyerController.purchaseProperty);

export default router;
