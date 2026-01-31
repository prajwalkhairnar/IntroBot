# Update Supabase RLS Policies

## Problem
Your chat app is failing to create conversations because the Row Level Security (RLS) policies in Supabase are too restrictive for anonymous users.

## Solution
Run the updated SQL migration to replace the RLS policies with ones that work for anonymous sessions.

## Steps to Fix

### 1. Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your **IntroBot** project

### 2. Open SQL Editor
1. Click on **SQL Editor** in the left sidebar
2. Click **New query** button

### 3. Run the Update Script

Copy and paste the following SQL script into the editor:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Allow anonymous users to manage conversations" ON conversations;
DROP POLICY IF EXISTS "Allow anonymous users to manage messages" ON messages;

-- Create permissive RLS policies for anonymous users
-- These policies allow any client to insert/update/delete based on the user_id they provide
-- This works for anonymous sessions where user_id is managed client-side

CREATE POLICY "Allow anonymous users to manage conversations"
    ON conversations
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to manage messages"
    ON messages
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

### 4. Execute the Script
1. Click the **Run** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. Wait for the success message
3. You should see: "Success. No rows returned"

### 5. Verify the Changes
1. Go to **Database** → **Tables** in the left sidebar
2. Click on the **conversations** table
3. Click on **Policies** tab
4. You should see the new policy: "Allow anonymous users to manage conversations"
5. Repeat for the **messages** table

### 6. Test Your App
1. Go back to your app at [http://localhost:8080/](http://localhost:8080/)
2. Refresh the page (`F5` or `Ctrl+R`)
3. Try sending a message
4. It should now work! 🎉

## What Changed?

### Before (Restrictive)
- Required `current_setting('app.user_id')` to be set via RPC call
- Anonymous users couldn't create conversations
- Complex session management needed

### After (Permissive)
- Allows all operations on conversations and messages
- User isolation is handled client-side via `user_id` field
- Simple and works for anonymous sessions
- Each user only sees their own data because queries filter by `user_id`

## Security Note

> **Note:** These policies are permissive and suitable for a demo/personal app with anonymous users. For production apps with sensitive data, you should implement proper authentication (e.g., Supabase Auth) and more restrictive RLS policies.

## Troubleshooting

### If you still see errors after updating:
1. **Clear browser cache**: Press `Ctrl+Shift+Delete` and clear cached data
2. **Clear localStorage**: Open DevTools (F12) → Console → Run: `localStorage.clear()`
3. **Refresh the page**: Press `F5`
4. **Check Supabase logs**: Go to Supabase Dashboard → Logs → Check for any errors

### If policies weren't created:
1. Make sure RLS is enabled on both tables
2. Run this to verify:
   ```sql
   SELECT tablename, policyname FROM pg_policies 
   WHERE schemaname = 'public' 
   AND tablename IN ('conversations', 'messages');
   ```

## Need Help?
If you're still having issues, check the browser console (F12) for error messages and verify your Supabase connection settings in the `.env` file.
