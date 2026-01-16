-- Simple debug script that works with PostgreSQL
-- Check for issues without using problematic columns

-- 1. Check if user_profiles table exists and its structure
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles';

-- 2. Check columns in user_profiles
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS policies on user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 4. Check for any triggers on auth.users or user_profiles
SELECT event_object_table, trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE trigger_schema IN ('auth', 'public')
AND event_object_table IN ('users', 'user_profiles')
ORDER BY event_object_table, trigger_name;

-- 5. Check foreign key constraints
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'user_profiles';

-- 6. Test basic insert (commented out for safety)
-- INSERT INTO user_profiles (user_id, email, full_name, phone_number, country, gender)
-- VALUES ('test-id', 'test@example.com', 'Test User', '+1234567890', 'Test Country', 'male');

-- 7. Check if auth.users has any triggers
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
AND event_object_table = 'users';
