-- Simple setup to ensure user_profiles table works
-- Check if table exists and has basic structure

-- Disable RLS temporarily to allow direct inserts
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Ensure basic columns exist
DO $$
BEGIN
    -- Add email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'email'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN email VARCHAR(255);
    END IF;

    -- Add phone_number column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'phone_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN phone_number VARCHAR(20);
    END IF;

    -- Add country column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' 
        AND column_name = 'country'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN country VARCHAR(100);
    END IF;
END $$;

-- Re-enable RLS with simple policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON user_profiles;

-- Create a simple policy that allows users to manage their own profile
CREATE POLICY "Users can manage their own profile" 
ON user_profiles FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Test the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
