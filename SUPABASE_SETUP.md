# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Name: `project-tracker`
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Create Local Environment File

1. In your project root, create a file named `.env`
2. Add your keys:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Set Up Database Tables

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Enable Row Level Security
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  subtasks JSONB DEFAULT '[]',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX tasks_user_id_idx ON tasks(user_id);
CREATE INDEX tasks_status_idx ON tasks(status);
CREATE INDEX notes_user_id_idx ON notes(user_id);
```

## Step 5: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these two variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Click **Save**

## Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:5174 and you should see a login screen!

## Step 7: Deploy to Vercel

```bash
git add .
git commit -m "Add Supabase authentication and sync"
git push
```

Vercel will automatically redeploy with your environment variables.

---

## Troubleshooting

**"Missing Supabase environment variables" error:**
- Make sure you created `.env` file in project root
- Restart dev server after creating `.env`

**Can't log in:**
- Check SQL was executed successfully in Supabase
- Make sure Row Level Security policies are enabled
- Check browser console for errors

**Data not syncing:**
- Open browser DevTools → Network tab
- Look for Supabase API calls
- Check for authentication errors
