import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const { data, error } = await supabase
            .from('admin_credentials')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (data.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, service: data.service });
    } catch (error: any) {
        console.error('Admin login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

export const getCredentials = async (req: Request, res: Response) => {
    // In a real app we would check session/token here
    try {
        const { data, error } = await supabase
            .from('admin_credentials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data || []);
    } catch (error: any) {
        console.error('Error fetching credentials:', error);
        res.status(500).json({ error: error.message });
    }
};
