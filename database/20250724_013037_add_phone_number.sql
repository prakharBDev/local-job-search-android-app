-- Migration to add phone_number column to users table
-- This adds phone number support for user contact information

-- Add the phone_number column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Add a comment to clarify the phone_number field usage
COMMENT ON COLUMN users.phone_number IS 'User phone number for contact purposes'; 