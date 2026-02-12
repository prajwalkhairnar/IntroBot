import { Router } from 'express';
import {
    getConversations,
    createConversation,
    updateConversation,
    deleteConversation
} from '../controllers/conversationController';

const router = Router();

router.get('/', getConversations);
router.post('/', createConversation);
router.patch('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;
