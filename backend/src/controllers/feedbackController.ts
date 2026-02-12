import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const submitFeedback = async (req: Request, res: Response) => {
    try {
        const { rating, comments, email, userId } = req.body;

        if (!rating) {
            return res.status(400).json({ error: 'Rating is required' });
        }

        const { error } = await supabase.from('feedback').insert({
            rating,
            comments: comments?.trim() || null,
            email: email?.trim() || null,
            user_id: userId || null,
        });

        if (error) throw error;

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: error.message });
    }
};
