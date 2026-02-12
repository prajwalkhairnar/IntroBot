import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        const conversations = data.map(conv => ({
            id: conv.id,
            title: conv.title,
            createdAt: conv.created_at,
            updatedAt: conv.updated_at,
            isArchived: conv.is_archived,
            messageCount: conv.message_count,
            lastMessagePreview: conv.last_message_preview,
        }));

        res.json(conversations);
    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createConversation = async (req: Request, res: Response) => {
    try {
        const userId = req.headers['x-user-id'] as string;
        const { title } = req.body;

        if (!userId) return res.status(400).json({ error: 'User ID required' });
        if (!title) return res.status(400).json({ error: 'Title required' });

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

        if (error) throw error;

        res.json({ id: data.id });
    } catch (error: any) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateConversation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updateData: any = {};
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.lastMessagePreview !== undefined) updateData.last_message_preview = updates.lastMessagePreview;
        if (updates.messageCount !== undefined) updateData.message_count = updates.messageCount;
        if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;

        const { error } = await supabase
            .from('conversations')
            .update(updateData)
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('conversations')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: error.message });
    }
};
