-- Migration: Add missing fields to company_profiles table
-- Date: 2025-07-24 01:30:05

-- Add missing fields to company_profiles table
ALTER TABLE company_profiles 
ADD COLUMN industry TEXT,
ADD COLUMN company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large')),
ADD COLUMN website TEXT,
ADD COLUMN contact_email TEXT;

-- Add indexes for better performance
CREATE INDEX idx_company_profiles_industry ON company_profiles(industry);
CREATE INDEX idx_company_profiles_company_size ON company_profiles(company_size);

-- Update RLS policies to include new fields
-- The existing policies should work with the new fields since they're based on user_id 