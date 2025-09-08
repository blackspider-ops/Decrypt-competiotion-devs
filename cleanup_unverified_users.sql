-- Manual cleanup script for unverified users
-- Run this in Supabase SQL Editor to clean up unverified users

-- First, let's see what we're dealing with
SELECT 
  'Unverified users count' as description,
  COUNT(*) as count
FROM auth.users 
WHERE email_confirmed_at IS NULL

UNION ALL

SELECT 
  'Profiles for unverified users' as description,
  COUNT(*) as count
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email_confirmed_at IS NULL;

-- Clean up unverified users (uncomment to execute)
/*
-- Delete certificates for unverified users
DELETE FROM public.certificates 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email_confirmed_at IS NULL
);

-- Delete challenge progress for unverified users  
DELETE FROM public.challenge_progress 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email_confirmed_at IS NULL
);

-- Delete user summary for unverified users
DELETE FROM public.user_summary 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email_confirmed_at IS NULL
);

-- Delete profiles for unverified users
DELETE FROM public.profiles 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email_confirmed_at IS NULL
);
*/

-- Check current triggers on auth.users table
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
  AND event_object_schema = 'auth';

-- Check if any profiles exist for unverified users (should be 0 after cleanup)
SELECT 
  p.full_name,
  p.email,
  u.email_confirmed_at,
  u.created_at
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email_confirmed_at IS NULL
ORDER BY u.created_at DESC;