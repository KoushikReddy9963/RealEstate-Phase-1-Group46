import express from 'express';
import { getAdvertisements } from '../controllers/Advertisementcontroller.js';

const router = express.Router();

router.get('/Advertisement', getAdvertisements);

export default router;