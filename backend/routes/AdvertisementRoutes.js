import express from 'express';
import { getAdvertisement } from '../controllers/Advertisementcontroller.js';

const router = express.Router();

router.get('/Advertisement', getAdvertisement);

export default router;
