-- JobApp Database Schema (Final Version)
-- This schema supports both job seekers and job posters with proper relationships and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables

-- Users table (Main user table)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL, -- for Google OAuth
    google_id TEXT UNIQUE, -- from Google OAuth
    name TEXT NOT NULL, -- from Google profile or user input
    phone_number TEXT, -- user's phone number for contact
    city TEXT CHECK (city IN ('morena', 'gwalior')),
    is_seeker BOOLEAN DEFAULT true, -- true = job seeker, false = job poster/company
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seeker profiles (Job seeker details)
CREATE TABLE seeker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenth_percentage DECIMAL(5,2), -- Optional
    twelfth_percentage DECIMAL(5,2), -- Optional
    graduation_percentage DECIMAL(5,2), -- Optional
    experience_level TEXT CHECK (experience_level IN ('fresher', 'entry', 'mid', 'senior')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company profiles (Business owner details)
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    company_description TEXT, -- Optional
    is_verified BOOLEAN DEFAULT false, -- managed by admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills (Dynamic skill management)
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job categories
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs (Job postings)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    salary TEXT, -- Optional - supports ranges like "20,000-30,000"
    category_id UUID REFERENCES job_categories(id), -- nullable
    city TEXT CHECK (city IN ('morena', 'gwalior')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications (Job application tracking)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    seeker_id UUID REFERENCES seeker_profiles(id) ON DELETE CASCADE,
    message TEXT CHECK (LENGTH(message) <= 100), -- Optional, max 100 characters
    status TEXT CHECK (status IN ('applied', 'under_review', 'hired', 'rejected')) DEFAULT 'applied',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, seeker_id) -- prevents duplicate applications
);

-- Junction Tables (Many-to-Many Relationships)

-- Seeker skills (Seeker ↔ Skills)
CREATE TABLE seeker_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seeker_id UUID REFERENCES seeker_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seeker_id, skill_id)
);

-- Seeker categories (Seeker ↔ Job Categories)
CREATE TABLE seeker_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seeker_id UUID REFERENCES seeker_profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES job_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seeker_id, category_id)
);

-- Job skills (Jobs ↔ Required Skills)
CREATE TABLE job_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, skill_id)
);

-- Triggers for auto-updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seeker_profiles_updated_at BEFORE UPDATE ON seeker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_seeker_profiles_user_id ON seeker_profiles(user_id);
CREATE INDEX idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_category_id ON jobs(category_id);
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_seeker_id ON applications(seeker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_seeker_skills_seeker_id ON seeker_skills(seeker_id);
CREATE INDEX idx_seeker_skills_skill_id ON seeker_skills(skill_id);
CREATE INDEX idx_seeker_categories_seeker_id ON seeker_categories(seeker_id);
CREATE INDEX idx_seeker_categories_category_id ON seeker_categories(category_id);
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for seeker_profiles table
CREATE POLICY "Users can view their own seeker profile" ON seeker_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own seeker profile" ON seeker_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own seeker profile" ON seeker_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for company_profiles table
CREATE POLICY "Users can view their own company profile" ON company_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile" ON company_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company profile" ON company_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for skills table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view skills" ON skills
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for job_categories table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view job categories" ON job_categories
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for jobs table
CREATE POLICY "Anyone can view active jobs" ON jobs
    FOR SELECT USING (is_active = true);

CREATE POLICY "Company owners can view their own jobs" ON jobs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM company_profiles 
            WHERE company_profiles.id = jobs.company_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Company owners can insert jobs" ON jobs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM company_profiles 
            WHERE company_profiles.id = jobs.company_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Company owners can update their own jobs" ON jobs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM company_profiles 
            WHERE company_profiles.id = jobs.company_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for applications table
CREATE POLICY "Seekers can view their own applications" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM seeker_profiles 
            WHERE seeker_profiles.id = applications.seeker_id 
            AND seeker_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Company owners can view applications for their jobs" ON applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            JOIN company_profiles ON jobs.company_id = company_profiles.id
            WHERE jobs.id = applications.job_id 
            AND company_profiles.user_id = auth.uid()
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

CREATE POLICY "Company owners can update applications for their jobs" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            JOIN company_profiles ON jobs.company_id = company_profiles.id
            WHERE jobs.id = applications.job_id 
            AND company_profiles.user_id = auth.uid()
        )
    );

-- RLS Policies for junction tables
CREATE POLICY "Users can manage their own seeker skills" ON seeker_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seeker_profiles 
            WHERE seeker_profiles.id = seeker_skills.seeker_id 
            AND seeker_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can manage their own seeker categories" ON seeker_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seeker_profiles 
            WHERE seeker_profiles.id = seeker_categories.seeker_id 
            AND seeker_profiles.user_id = auth.uid()
        )
    );

CREATE POLICY "Company owners can manage job skills for their jobs" ON job_skills
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM jobs 
            JOIN company_profiles ON jobs.company_id = company_profiles.id
            WHERE jobs.id = job_skills.job_id 
            AND company_profiles.user_id = auth.uid()
        )
    ); 