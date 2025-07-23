-- Migration to remove is_poster column from users table
-- Since we're using is_seeker to determine user type (true = seeker, false = poster/company)

-- Remove the is_poster column
ALTER TABLE users DROP COLUMN IF EXISTS is_poster;

-- Add a comment to clarify the is_seeker field usage
COMMENT ON COLUMN users.is_seeker IS 'true = job seeker, false = job poster/company'; 