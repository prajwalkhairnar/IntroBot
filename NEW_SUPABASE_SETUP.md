# Setting Up New Supabase Project for IntroBot

Follow these steps to create a new Supabase project and migrate your database structure.

## Step 1: Create New Supabase Project

1. **Go to Supabase Dashboard**
   - Navigate to [https://app.supabase.com](https://app.supabase.com)
   - Sign in to your account

2. **Create New Project**
   - Click the **"New Project"** button
   - Fill in the project details:
     - **Name**: `IntroBot` (or `introbot`)
     - **Database Password**: Create a strong password and **SAVE IT SECURELY**
     - **Region**: Choose the region closest to you or your users
     - **Pricing Plan**: Select your preferred plan (Free tier is fine for development)
   
3. **Wait for Project Creation**
   - Click **"Create new project"**
   - Wait approximately 2 minutes for the project to be provisioned
   - You'll see a progress indicator

## Step 2: Run Database Migration

1. **Open SQL Editor**
   - In your new Supabase project dashboard
   - Click **"SQL Editor"** in the left sidebar
   - Click **"New query"** button

2. **Copy Migration Script**
   - Open the file `supabase_migration.sql` in your IntroBot project
   - Copy the **entire contents** of the file

3. **Execute Migration**
   - Paste the SQL script into the Supabase SQL Editor
   - Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
   - Wait for the success message

4. **Verify Tables Created**
   - Go to **"Table Editor"** in the left sidebar
   - You should see two tables:
     - ✅ `conversations`
     - ✅ `messages`
   - Click on each table to verify the structure

## Step 3: Get API Credentials

1. **Navigate to API Settings**
   - In your Supabase dashboard, go to **Settings** → **API**

2. **Copy Your Credentials**
   - **Project URL**: Copy the URL (looks like `https://xxxxx.supabase.co`)
   - **anon/public key**: Copy the key under "Project API keys" → "anon public"
   
   ⚠️ **Important**: Keep these credentials secure!

## Step 4: Update Environment Variables

### Frontend Environment Variables

1. **Edit `.env` file in project root**
   ```bash
   # Open the file
   # Location: c:\Users\PKhairnar\OneDrive\Documents\local\Github Repos\IntroBot\.env
   ```

2. **Update with your new credentials**
   ```env
   VITE_SUPABASE_URL=https://your-new-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
   VITE_BACKEND_URL=http://localhost:3001
   ```

### Backend Environment Variables (if needed)

If your backend uses Supabase directly, update:
```bash
# Location: c:\Users\PKhairnar\OneDrive\Documents\local\Github Repos\IntroBot\backend\.env
```

## Step 5: Restart Development Servers

Since you already have the servers running, you need to restart them to pick up the new environment variables:

1. **Stop Both Servers**
   - In your terminals, press `Ctrl+C` to stop each server

2. **Restart Frontend**
   ```bash
   # In the root directory
   npm run dev
   ```

3. **Restart Backend**
   ```bash
   # In the backend directory
   cd backend
   npm run dev
   ```

## Step 6: Test the New Setup

1. **Open Your App**
   - Navigate to `http://localhost:5173` (or whatever port Vite shows)

2. **Create a Test Conversation**
   - Click "New Chat"
   - Send a test message
   - Wait for AI response

3. **Verify in Supabase**
   - Go to your Supabase dashboard
   - Navigate to **Table Editor** → **messages**
   - You should see your test message!

4. **Test Real-time Sync**
   - Open the app in two browser tabs
   - Send a message in one tab
   - Verify it appears in both tabs instantly

## ✅ Verification Checklist

- [ ] New Supabase project created with name "IntroBot"
- [ ] Database migration script executed successfully
- [ ] Tables `conversations` and `messages` visible in Table Editor
- [ ] Project URL and anon key copied
- [ ] Frontend `.env` file updated with new credentials
- [ ] Development servers restarted
- [ ] Test message sent and saved to database
- [ ] Real-time sync working across tabs

## 🔒 Security Notes

1. **Never commit `.env` files** to git (they should already be in `.gitignore`)
2. **The anon key is safe to expose** in frontend code - it's protected by Row Level Security (RLS)
3. **Keep your database password secure** - you'll need it for direct database access
4. **RLS policies are permissive** for anonymous users - suitable for demo/personal use

## 🎯 What Gets Preserved

Your new Supabase project will have the **exact same structure** as your old one:

- ✅ Same table schemas (`conversations` and `messages`)
- ✅ Same indexes for performance
- ✅ Same RLS policies for security
- ✅ Same triggers for auto-updating timestamps
- ✅ Same foreign key relationships

**What's Different:**
- ❌ No existing data (fresh start)
- ✅ New project URL
- ✅ New API keys
- ✅ Branded as "IntroBot" instead of "Aura Chat"

## 🆘 Troubleshooting

### "Missing environment variables" error
- Make sure you updated the `.env` file
- Verify variable names start with `VITE_`
- Restart the dev server after editing `.env`

### Messages not saving
- Check browser console for errors
- Verify Supabase credentials are correct
- Confirm migration script ran successfully

### Real-time not working
- Check browser console for WebSocket errors
- Verify your Supabase project has Realtime enabled (it's on by default)
- Try refreshing the page

---

**Need Help?** Check the browser console (F12) for detailed error messages.
