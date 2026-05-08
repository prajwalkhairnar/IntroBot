# Supabase Setup Guide

This guide covers two things:
1. **Creating a new Supabase project** for IntroBot
2. **Updating RLS policies** if you hit anonymous-user permission errors

---

## Part 1 — Setting Up a New Supabase Project

### Step 1: Create a New Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and sign in
2. Click **"New Project"** and fill in:
   - **Name**: `IntroBot`
   - **Database Password**: Create a strong password and save it securely
   - **Region**: Choose the closest region to you or your users
   - **Pricing Plan**: Free tier works fine for development
3. Click **"Create new project"** and wait ~2 minutes for provisioning

### Step 2: Run the Database Migration

1. In your project dashboard, click **"SQL Editor"** → **"New query"**
2. Open `supabase_migration.sql` from the IntroBot root and copy the entire contents
3. Paste into the SQL Editor and click **"Run"** (`Ctrl+Enter` / `Cmd+Enter`)
4. Verify in **"Table Editor"** that two tables were created:
   - ✅ `conversations`
   - ✅ `messages`

### Step 3: Get Your API Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys" → "anon public")

### Step 4: Update Environment Variables

**Frontend** (`.env` in project root):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_BACKEND_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
# Only needed if your backend uses Supabase directly
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 5: Restart and Test

1. Restart both dev servers (see [SETUP.md](./SETUP.md))
2. Navigate to `http://localhost:5173`
3. Create a test conversation and send a message
4. Check **Table Editor** → **messages** in Supabase to confirm it saved
5. Open the app in two tabs and verify real-time sync works

### Verification Checklist

- [ ] New Supabase project created
- [ ] Database migration script executed successfully
- [ ] Tables `conversations` and `messages` visible in Table Editor
- [ ] Project URL and anon key copied
- [ ] `.env` files updated with new credentials
- [ ] Dev servers restarted
- [ ] Test message saved to database
- [ ] Real-time sync working across tabs

---

## Part 2 — Fixing RLS Policies for Anonymous Users

If your app fails to create conversations with permission errors, the Row Level Security policies need to be updated to allow anonymous sessions.

### Steps

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your IntroBot project
2. Click **"SQL Editor"** → **"New query"**
3. Paste and run the following:

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

4. Verify in **Database** → **Tables** → **Policies** that both new policies appear
5. Refresh your app (`F5`) and test sending a message

### Security Note

These permissive policies are appropriate for a personal/demo app using anonymous sessions. User isolation is handled client-side via the `user_id` field in queries. For production apps with sensitive data, implement Supabase Auth with proper authentication-based RLS policies.

### Troubleshooting

| Issue | Fix |
|---|---|
| Still seeing errors after update | Clear browser cache + localStorage (`localStorage.clear()` in DevTools console) |
| Policies not created | Ensure RLS is enabled on both tables before running the script |
| Missing env variables error | Verify variable names start with `VITE_` and restart the dev server |
| Messages not saving | Check browser console (F12) for errors and verify Supabase credentials |
| Real-time not working | Check for WebSocket errors in console; Realtime is enabled by default in Supabase |
