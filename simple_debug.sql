-- Simple debug script to find what's creating profiles

-- 1. Check triggers on auth.users
SELECT 
  'auth.users triggers:' as info,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- 2. Check triggers on profiles table  
SELECT 
  'profiles triggers:' as info,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles' 
  AND event_object_schema = 'public';

-- 3. Check what functions exist that might create profiles
SELECT 
  'Functions that mention profiles:' as info,
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_definition ILIKE '%profiles%'
  AND routine_schema = 'public'
  AND routine_name LIKE '%user%';

-- 4. Check current unverified profiles
SELECT 
  'Unverified profiles:' as info,
  p.full_name,
  p.email,
  u.email_confirmed_at,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email_confirmed_at IS NULL
ORDER BY p.created_at DESC
LIMIT 5;