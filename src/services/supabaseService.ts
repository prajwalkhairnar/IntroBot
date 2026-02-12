import { api } from '@/lib/api';
import { Conversation, Message } from '@/types/chat';

/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
    const data = await api.conversations.list();
    return data.map((conv: any) => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        isArchived: conv.isArchived,
        messageCount: conv.messageCount,
        lastMessagePreview: conv.lastMessagePreview,
    }));
}

/**
 * Create a new conversation
 */
export async function createConversation(title: string): Promise<string> {
    const { id } = await api.conversations.create(title);
    return id;
}

/**
 * Update conversation metadata
 */
export async function updateConversation(
    id: string,
    updates: {
        title?: string;
        lastMessagePreview?: string;
        messageCount?: number;
        isArchived?: boolean;
    }
): Promise<void> {
    await api.conversations.update(id, updates);
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
    await api.conversations.delete(id);
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const data = await api.messages.list(conversationId);
    return data.map((msg: any) => ({
        id: msg.id,
        conversationId: msg.conversationId,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt,
    }));
}

/**
 * Create a new message
 */
export async function createMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<Message> {
    const data = await api.messages.create(conversationId, role, content);
    return {
        id: data.id,
        conversationId: data.conversationId,
        role: data.role,
        content: data.content,
        createdAt: data.createdAt,
    };
}


