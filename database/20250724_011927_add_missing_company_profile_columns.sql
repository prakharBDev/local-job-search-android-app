-- Migration: Add missing company profile columns
-- Date: 2024-12-20
-- Author: AI Assistant
-- Purpose: Add missing columns to company_profiles table for EditProfileScreen functionality

-- =====================================================
-- MIGRATION START
-- =====================================================

-- Add missing columns to company_profiles table
ALTER TABLE company_profiles 
ADD COLUMN industry TEXT,
ADD COLUMN company_size TEXT,
ADD COLUMN website TEXT,
ADD COLUMN contact_email TEXT;

-- Add indexes for better performance
CREATE INDEX idx_company_profiles_industry ON company_profiles(industry);
CREATE INDEX idx_company_profiles_company_size ON company_profiles(company_size);

-- =====================================================
-- MIGRATION END
-- =====================================================

-- Rollback instructions:
-- ALTER TABLE company_profiles DROP COLUMN industry;
-- ALTER TABLE company_profiles DROP COLUMN company_size;
-- ALTER TABLE company_profiles DROP COLUMN website;
-- ALTER TABLE company_profiles DROP COLUMN contact_email;
-- DROP INDEX IF EXISTS idx_company_profiles_industry;
-- DROP INDEX IF EXISTS idx_company_profiles_company_size;
