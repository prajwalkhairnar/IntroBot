import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';

const router = Router();

router.get('/overview', getAnalytics);

export default router;
