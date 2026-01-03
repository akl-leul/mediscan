-- Debug script to identify auth issues
-- Check for problematic triggers or constraints

-- 1. Check if there are any triggers on auth.users
SELECT trigger_name, event_manipulation, action_timing, action_condition, action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
AND event_object_table = 'users';

-- 2. Check user_profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS policies on user_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. Check for any foreign key constraints
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
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

-- 5. Temporarily disable ALL triggers on auth.users
-- Uncomment if needed: DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 6. Check if user_profiles table exists and is accessible
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'user_profiles'
) as table_exists;

-- 7. Check recent auth errors in logs (if available)
-- This might not work in all Supabase instances
SELECT query, calls, total_time, rows, 100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements 
WHERE query LIKE '%auth%' OR query LIKE '%user_profiles%'
ORDER BY total_time DESC
LIMIT 10;
