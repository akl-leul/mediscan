-- Add missing columns to user_profiles table if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Update existing records to have email from auth.users if missing
UPDATE user_profiles 
SET email = auth.users.email
FROM auth.users 
WHERE user_profiles.user_id = auth.users.id AND user_profiles.email IS NULL;

-- Update existing records to have default values if needed
UPDATE user_profiles 
SET phone_number = COALESCE(phone_number, phone) 
WHERE phone_number IS NULL AND phone IS NOT NULL;

-- Enable Row Level Security if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create policies for user_profiles
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = user_id);
