import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const registerInterest = async (req: Request, res: Response) => {
    try {
        const { email, source } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        const { error } = await supabase
            .from('interest_registrations')
            .insert([
                {
                    email: email.toLowerCase().trim(),
                    source: source || 'welcome_screen',
                },
            ]);

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ error: 'This email has already been registered.' });
            }
            throw error;
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('Error registering interest:', error);
        res.status(500).json({ error: 'Failed to register interest. Please try again.' });
    }
};
