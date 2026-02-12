import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { join } from 'path';

// Ensure environment variables are loaded if this file is imported directly (e.g. in tests)
// In production/server.ts, dotenv should be called at the entry point.
if (!process.env.VITE_SUPABASE_URL) {
    dotenv.config({ path: join(__dirname, '../../.env') });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Anon Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
