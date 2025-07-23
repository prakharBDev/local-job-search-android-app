-- Fix RLS policies for seeker_profiles table
-- The current policy might be too restrictive or have syntax issues

-- First, drop the existing policies
DROP POLICY IF EXISTS "Users can view their own seeker profile" ON seeker_profiles;
DROP POLICY IF EXISTS "Users can update their own seeker profile" ON seeker_profiles;
DROP POLICY IF EXISTS "Users can insert their own seeker profile" ON seeker_profiles;

-- Recreate the policies with more explicit conditions
CREATE POLICY "Users can view their own seeker profile" ON seeker_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own seeker profile" ON seeker_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own seeker profile" ON seeker_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Also add a more permissive policy for debugging (temporary)
-- This allows any authenticated user to insert seeker profiles
-- Remove this after testing
CREATE POLICY "Allow authenticated users to insert seeker profiles" ON seeker_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 