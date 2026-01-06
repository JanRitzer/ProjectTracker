# Username Feature - Database Update

## Step 1: Create user_profiles Table

Go to your Supabase SQL Editor and run this:

```sql
-- Create user_profiles table to store usernames
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (for future features like @mentions)
CREATE POLICY "Anyone can view user profiles"
  ON user_profiles FOR SELECT
  USING (true);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create index for username lookups
CREATE INDEX user_profiles_username_idx ON user_profiles(username);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTR(NEW.id::text, 1, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 2: Configure Email Redirect URL

1. Go to: https://supabase.com/dashboard/project/lopxdzlzssmhoxabpmhc
2. Click **Authentication** → **URL Configuration**
3. Add these URLs to **Redirect URLs**:
   - `http://localhost:5173/**`
   - `https://project-tracker-gamma-three.vercel.app/**`
4. Set **Site URL** to: `https://project-tracker-gamma-three.vercel.app`
5. Click **Save**

This enables auto-login after email confirmation!

## Step 3: Enable "Confirm Email" Setting

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Email**
3. Make sure **"Confirm email"** is ENABLED
4. Click **Save**

---

**Note:** After running the SQL, the app will automatically handle username creation and storage!
