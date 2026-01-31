import { Router } from 'express';
import { generateAIResponse, generateConversationTitle } from '../services/aiService';
import { Message } from '../types/chat';

const router = Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
    try {
        const { conversationHistory } = req.body as { conversationHistory: Message[] };

        if (!conversationHistory || !Array.isArray(conversationHistory)) {
            return res.status(400).json({ error: 'Invalid conversation history' });
        }

        const response = await generateAIResponse(conversationHistory);
        res.json({ response });
    } catch (error) {
        console.error('Error in /chat:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// POST /api/ai/title
router.post('/title', async (req, res) => {
    try {
        const { firstUserMessage, firstAIResponse } = req.body;

        if (!firstUserMessage || !firstAIResponse) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const title = await generateConversationTitle(firstUserMessage, firstAIResponse);
        res.json({ title });
    } catch (error) {
        console.error('Error in /title:', error);
        res.status(500).json({ error: 'Failed to generate title' });
    }
});

export default router;
