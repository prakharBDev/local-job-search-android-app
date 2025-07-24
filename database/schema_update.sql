-- Update users table to match current codebase expectations
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- Update RLS policies to match current authentication patterns
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Seekers can view own profile" ON seeker_profiles;
DROP POLICY IF EXISTS "Seekers can update own profile" ON seeker_profiles;
DROP POLICY IF EXISTS "Companies can view own profile" ON company_profiles;
DROP POLICY IF EXISTS "Companies can update own profile" ON company_profiles;
DROP POLICY IF EXISTS "Everyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can manage own jobs" ON jobs;
DROP POLICY IF EXISTS "Seekers can view own applications" ON applications;
DROP POLICY IF EXISTS "Companies can view applications to their jobs" ON applications;

-- Create updated RLS policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Seeker profiles
CREATE POLICY "Seekers can view own profile" ON seeker_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Seekers can update own profile" ON seeker_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Seekers can insert own profile" ON seeker_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Company profiles
CREATE POLICY "Companies can view own profile" ON company_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies can update own profile" ON company_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert own profile" ON company_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs
CREATE POLICY "Everyone can view active jobs" ON jobs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Companies can manage own jobs" ON jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM company_profiles 
            WHERE company_profiles.id = jobs.company_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

-- Applications
CREATE POLICY "Seekers can view own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM seeker_profiles 
            WHERE seeker_profiles.id = applications.seeker_id 
            AND seeker_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Seekers can insert applications" ON applications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM seeker_profiles 
            WHERE seeker_profiles.id = applications.seeker_id 
            AND seeker_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Companies can view applications to their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            JOIN company_profiles ON jobs.company_id = company_profiles.id
            WHERE jobs.id = applications.job_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Companies can update applications to their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            JOIN company_profiles ON jobs.company_id = company_profiles.id
            WHERE jobs.id = applications.job_id 
            AND company_profiles.user_id = auth.uid()
        )
    ); 