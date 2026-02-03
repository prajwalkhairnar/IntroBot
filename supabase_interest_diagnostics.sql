-- Diagnostic queries to check interest_registrations table

-- 1. Check if table exists and see all data
SELECT * FROM interest_registrations;

-- 2. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'interest_registrations';

-- 3. Count total registrations
SELECT COUNT(*) as total_registrations FROM interest_registrations;

-- 4. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'interest_registrations';
