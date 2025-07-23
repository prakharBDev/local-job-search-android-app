-- Cleanup RLS policies - remove temporary permissive policy
-- Since the main policy is now working correctly, we can remove the temporary one

-- Remove the temporary permissive policy
DROP POLICY IF EXISTS "Allow authenticated users to insert seeker profiles" ON seeker_profiles;

-- Verify the main policies are still in place
-- Users can view their own seeker profile
-- Users can update their own seeker profile  
-- Users can insert their own seeker profile 