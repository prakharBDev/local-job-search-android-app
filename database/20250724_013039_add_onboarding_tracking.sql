-- Migration: Add onboarding tracking columns to users table
-- Date: 2025-07-24
-- Author: AI Assistant
-- Purpose: Add columns to track onboarding progress and prevent showing onboarding repeatedly
-- This migration adds columns to track onboarding progress and prevent showing onboarding repeatedly

-- Add onboarding tracking columns to users table
ALTER TABLE users 
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN last_onboarding_step TEXT,
ADD COLUMN onboarding_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Add index for onboarding status queries
CREATE INDEX idx_users_onboarding_completed ON users(onboarding_completed);
CREATE INDEX idx_users_last_onboarding_step ON users(last_onboarding_step);

-- Update existing users to mark them as having completed onboarding if they have profiles
UPDATE users 
SET 
  onboarding_completed = true,
  last_onboarding_step = 'completed',
  onboarding_completed_at = NOW()
WHERE id IN (
  SELECT DISTINCT u.id 
  FROM users u
  LEFT JOIN seeker_profiles sp ON u.id = sp.user_id
  LEFT JOIN company_profiles cp ON u.id = cp.user_id
  WHERE sp.id IS NOT NULL OR cp.id IS NOT NULL
);

-- Update users with city selected but no profiles to mark them as in progress
UPDATE users 
SET 
  onboarding_completed = false,
  last_onboarding_step = 'city_selected',
  onboarding_started_at = COALESCE(created_at, NOW())
WHERE city IS NOT NULL 
  AND id NOT IN (
    SELECT DISTINCT u.id 
    FROM users u
    LEFT JOIN seeker_profiles sp ON u.id = sp.user_id
    LEFT JOIN company_profiles cp ON u.id = cp.user_id
    WHERE sp.id IS NOT NULL OR cp.id IS NOT NULL
  ); 