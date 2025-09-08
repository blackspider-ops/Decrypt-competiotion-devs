-- Test if our profile blocking trigger is working

-- Try to manually insert a profile (this should fail)
DO $$
BEGIN
  BEGIN
    INSERT INTO public.profiles (user_id, full_name, email, role)
    VALUES ('00000000-0000-0000-0000-000000000000', 'Test User', 'test@example.com', 'player');
    RAISE NOTICE 'ERROR: Profile insert was allowed when it should have been blocked!';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'SUCCESS: Profile insert was blocked as expected. Error: %', SQLERRM;
  END;
END $$;

-- Check if our blocking trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles' 
  AND event_object_schema = 'public'
  AND trigger_name = 'block_profile_creation';

-- Check if our blocking function exists
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'block_automatic_profile_creation'
  AND routine_schema = 'public';