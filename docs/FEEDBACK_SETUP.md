# Feedback Feature Setup

## Database Migration

To enable the feedback feature, you need to run the updated migration SQL in your Supabase SQL Editor.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Copy the contents of `supabase_migration.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify the Table**
   - Go to the Table Editor
   - You should see a new table called `feedback` with the following columns:
     - `id` (UUID, Primary Key)
     - `rating` (Integer, 1-5, Required)
     - `comments` (Text, Optional)
     - `email` (Text, Optional)
     - `user_id` (Text, Optional)
     - `created_at` (Timestamp)

## Features

### User Interface
- **Feedback Button**: Located in the sidebar below "New Chat"
- **Star Icon**: Represents rating/feedback functionality
- **Dialog Modal**: Clean, modern dialog for submitting feedback

### Feedback Form
- ⭐ **Star Rating** (Required): 1-5 stars with hover effects
- 💬 **Comments** (Optional): Textarea for detailed feedback
- 📧 **Email** (Optional): For follow-up if needed
- ✅ **Submit/Cancel**: Clear action buttons

### Data Storage
- All feedback is stored in the `feedback` table in Supabase
- User ID is automatically tracked (anonymous session ID)
- Timestamps are automatically recorded
- Row Level Security (RLS) is enabled with insert-only policy

## Usage

Users can submit feedback by:
1. Clicking the star icon in the sidebar
2. Selecting a rating (1-5 stars)
3. Optionally adding comments and email
4. Clicking "Submit Feedback"

A success toast notification confirms submission.

## Viewing Feedback Data

To view submitted feedback:
1. Go to Supabase Dashboard → Table Editor
2. Select the `feedback` table
3. View all submissions with ratings, comments, and timestamps

You can also query the data using SQL:
```sql
SELECT 
  rating,
  comments,
  email,
  created_at
FROM feedback
ORDER BY created_at DESC;
```

## Future Enhancements

Potential improvements:
- Admin dashboard to view and analyze feedback
- Email notifications for new feedback
- Feedback analytics and reporting
- Response system for following up with users
