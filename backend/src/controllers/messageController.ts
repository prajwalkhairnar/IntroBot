import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const messages = data.map(msg => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.created_at,
        }));

        res.json(messages);
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: error.message });
    }
};

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { conversationId, role, content } = req.body;

        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                role,
                content,
            })
            .select()
            .single();

        if (error) throw error;

        res.json({
            id: data.id,
            conversationId: data.conversation_id,
            role: data.role,
            content: data.content,
            createdAt: data.created_at,
        });
    } catch (error: any) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: error.message });
    }
};
