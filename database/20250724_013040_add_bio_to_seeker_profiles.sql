-- Migration: Add bio field to seeker_profiles table
-- Date: 2025-07-24 01:30:40
-- Purpose: Add bio field to seeker_profiles table for EditProfileScreen functionality

-- Add bio column to seeker_profiles table
ALTER TABLE seeker_profiles 
ADD COLUMN bio TEXT;

-- Add index for better performance
CREATE INDEX idx_seeker_profiles_bio ON seeker_profiles(bio);

-- Update RLS policies to include new field
-- The existing policies should work with the new field since they're based on user_id 