import { Router } from 'express';
import { registerInterest } from '../controllers/interestController';

const router = Router();

router.post('/', registerInterest);

export default router;
