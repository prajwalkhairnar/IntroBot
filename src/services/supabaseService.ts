import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/userSession';
import { Conversation, Message } from '@/types/chat';


/**
 * Get all conversations for the current user
 */
export async function getConversations(): Promise<Conversation[]> {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }

    return data.map(conv => ({
        id: conv.id,
        title: conv.title,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        isArchived: conv.is_archived,
        messageCount: conv.message_count,
        lastMessagePreview: conv.last_message_preview,
    }));
}

/**
 * Create a new conversation
 */
export async function createConversation(title: string): Promise<string> {
    const userId = getUserId();

    const { data, error } = await supabase
        .from('conversations')
        .insert({
            user_id: userId,
            title,
            message_count: 0,
            is_archived: false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating conversation:', error);
        throw error;
    }

    return data.id;
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
    const updateData: any = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.lastMessagePreview !== undefined) updateData.last_message_preview = updates.lastMessagePreview;
    if (updates.messageCount !== undefined) updateData.message_count = updates.messageCount;
    if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;

    const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Error updating conversation:', error);
        throw error;
    }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(id: string): Promise<void> {
    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting conversation:', error);
        throw error;
    }
}

/**
 * Get all messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }

    return data.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        createdAt: msg.created_at,
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
    const { data, error } = await supabase
        .from('messages')
        .insert({
            conversation_id: conversationId,
            role,
            content,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating message:', error);
        throw error;
    }

    return {
        id: data.id,
        conversationId: data.conversation_id,
        role: data.role as 'user' | 'assistant',
        content: data.content,
        createdAt: data.created_at,
    };
}

/**
 * Subscribe to new messages in a conversation
 */
export function subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
) {
    const subscription = supabase
        .channel(`messages:${conversationId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
                const msg = payload.new;
                callback({
                    id: msg.id,
                    conversationId: msg.conversation_id,
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                    createdAt: msg.created_at,
                });
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}
