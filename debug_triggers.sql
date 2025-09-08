-- Debug script to find ALL triggers and functions that might be creating profiles

-- 1. Check ALL triggers on auth.users (using information_schema)
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- 2. Check ALL triggers on profiles table
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'profiles' 
  AND event_object_schema = 'public';

-- 3. Check for any functions that insert into profiles
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%INSERT INTO%profiles%'
  AND routine_schema = 'public';

-- 4. Check for any RLS policies that might be creating profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Check current profiles for unverified users
SELECT 
  p.user_id,
  p.full_name,
  p.email,
  u.email_confirmed_at,
  u.created_at as auth_created,
  p.created_at as profile_created
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email_confirmed_at IS NULL
ORDER BY p.created_at DESC
LIMIT 10;