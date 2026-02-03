-- Supabase Migration: Interest Registrations Table
-- Run this SQL in your Supabase SQL Editor

-- Create interest_registrations table
CREATE TABLE IF NOT EXISTS interest_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'welcome_screen',
    user_agent TEXT,
    ip_address TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_interest_registrations_created_at ON interest_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_interest_registrations_email ON interest_registrations(email);

-- Enable Row Level Security
ALTER TABLE interest_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous users to register interest" ON interest_registrations;
DROP POLICY IF EXISTS "Allow anonymous users to read interest registrations" ON interest_registrations;

-- Create permissive RLS policy (allow anyone to submit their email)
CREATE POLICY "Allow anonymous users to register interest"
    ON interest_registrations
    FOR INSERT
    WITH CHECK (true);

-- Create permissive RLS policy (allow anyone to read for admin dashboard)
CREATE POLICY "Allow anonymous users to read interest registrations"
    ON interest_registrations
    FOR SELECT
    USING (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Interest registrations table created successfully!';
END $$;

