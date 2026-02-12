import { Router } from 'express';
import { login, getCredentials } from '../controllers/adminController';

const router = Router();

router.post('/login', login);
router.get('/credentials', getCredentials);

export default router;
