import { Router } from 'express';
import { getMessages, createMessage } from '../controllers/messageController';

const router = Router();

router.get('/:conversationId', getMessages);
router.post('/', createMessage);

export default router;
