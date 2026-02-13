import { Message } from '@/types/chat';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export async function generateAIResponse(conversationHistory: Message[]): Promise<string> {
    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationHistory }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    return data.response;
}

export async function generateConversationTitle(
    messages: Message[]
): Promise<string> {
    // Sanitize messages to ensure we only send necessary data and avoid circular references
    const sanitizedMessages = messages.map(m => ({
        role: m.role,
        content: m.content
    }));

    const response = await fetch(`${BACKEND_URL}/api/ai/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: sanitizedMessages }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Failed to generate title');
    }

    const data = await response.json();
    return data.title;
}
