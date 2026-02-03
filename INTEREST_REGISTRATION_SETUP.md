# Interest Registration Setup Guide

## Step 1: Run the SQL Migration

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Open the file `supabase_interest_registration.sql`
4. Copy and paste the SQL into the editor
5. Click "Run" to execute the migration

This will create the `interest_registrations` table with the following structure:
- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `created_at` (timestamp)
- `source` (TEXT, default: 'welcome_screen')
- `user_agent` (TEXT, optional)
- `ip_address` (TEXT, optional)

## Step 2: Verify the Table

After running the migration, you can verify the table was created by running:

```sql
SELECT * FROM interest_registrations;
```

## Step 3: Test the Feature

1. The frontend is already updated with the email input form
2. Visit your IntroBot welcome screen
3. Scroll to the bottom and you'll see "Want your own IntroBot?"
4. Enter an email and click "Register Interest"
5. Check your Supabase table to see the new entry

## Features

- ✅ Email validation (client-side)
- ✅ Duplicate email prevention (database constraint)
- ✅ Toast notifications for success/error
- ✅ Loading states during submission
- ✅ Enter key support for quick submission
- ✅ Responsive design matching your existing UI

## Viewing Registrations

To view all interest registrations in Supabase:

```sql
SELECT email, created_at, source 
FROM interest_registrations 
ORDER BY created_at DESC;
```

## Optional: Add Admin View

You can later add a section in your Mission Control (Analytics Dashboard) to view these registrations if needed.
