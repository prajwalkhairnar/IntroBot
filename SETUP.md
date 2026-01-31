# IntroBot - Supabase Setup Guide

## 🚀 Quick Start

Follow these steps to set up Supabase and get your chat application running with persistent storage and AI capabilities.

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `introbot` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
4. Click **"Create new project"** and wait ~2 minutes for setup

### 2. Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the `supabase_migration.sql` file in this project
4. Copy and paste the entire SQL content into the query editor
5. Click **"Run"** to execute the migration
6. Verify success: Go to **Table Editor** and confirm you see `conversations` and `messages` tables

### 3. Get Your API Credentials

1. In Supabase dashboard, go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (under "Project URL" section)
   - **anon/public key** (under "Project API keys" → "anon public")

### 4. Get Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/login (it's free!)
3. Go to **API Keys** section
4. Click **"Create API Key"**
5. Give it a name and copy the key

### 5. Configure Environment Variables

1. In your project root, create a `.env` file:
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

### 6. Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

## ✅ Verify Everything Works

1. **Create a conversation**: Click "New Chat" in the sidebar
2. **Send a message**: Type something and press Enter
3. **Check Supabase**: Go to your Supabase dashboard → Table Editor → `messages` table
   - You should see your message saved!
4. **Test AI response**: Wait for the AI to respond (powered by Groq)
5. **Test persistence**: Refresh the page
   - Your conversation should still be there!
6. **Test real-time**: Open the app in two browser tabs
   - Send a message in one tab
   - It should appear in both tabs instantly

## 🎯 Features

- ✅ **Persistent Storage**: All conversations and messages saved to Supabase
- ✅ **Real-time Updates**: Messages appear instantly across all tabs
- ✅ **AI Responses**: Powered by LangChain + Groq (llama-3.3-70b-versatile)
- ✅ **Multi-turn Conversations**: AI remembers full conversation context
- ✅ **Anonymous Sessions**: No login required, uses localStorage for user ID

## 🔧 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure you created the `.env` file in the project root
- Verify the variable names start with `VITE_`
- Restart the dev server after creating/editing `.env`

### Messages not saving to database
- Check your Supabase credentials are correct
- Verify the migration SQL ran successfully
- Check browser console for errors

### AI not responding
- Verify your Groq API key is correct
- Check you have internet connection
- Look for errors in browser console

### Real-time updates not working
- Supabase real-time is enabled by default
- Check browser console for subscription errors
- Try refreshing the page

## 📚 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: LangChain + Groq
- **Real-time**: Supabase Realtime

## 🤝 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase dashboard logs
3. Verify all environment variables are set correctly
4. Make sure the database migration ran successfully
