-- Sample Data Insert Commands for Job App Database
-- Note: User table data should be handled through Google OAuth authentication

-- ============================================================================
-- SKILLS DATA (Extended list for Indian job market)
-- ============================================================================

-- Inserting various technical, communication, business, and trade skills
INSERT INTO skills (id, name) VALUES 
    (uuid_generate_v4(), 'JavaScript'),
    (uuid_generate_v4(), 'Python'),
    (uuid_generate_v4(), 'Java'),
    (uuid_generate_v4(), 'React'),
    (uuid_generate_v4(), 'Node.js'),
    (uuid_generate_v4(), 'SQL'),
    (uuid_generate_v4(), 'HTML/CSS'),
    (uuid_generate_v4(), 'Android Development'),
    (uuid_generate_v4(), 'Flutter'),
    (uuid_generate_v4(), 'PHP'),
    
    -- Communication & Soft Skills
    (uuid_generate_v4(), 'English Communication'),
    (uuid_generate_v4(), 'Hindi Communication'),
    (uuid_generate_v4(), 'Customer Service'),
    (uuid_generate_v4(), 'Sales'),
    (uuid_generate_v4(), 'Team Leadership'),
    (uuid_generate_v4(), 'Problem Solving'),
    (uuid_generate_v4(), 'Time Management'),
    (uuid_generate_v4(), 'Presentation Skills'),
    
    -- Business & Office Skills
    (uuid_generate_v4(), 'Microsoft Office'),
    (uuid_generate_v4(), 'Excel Advanced'),
    (uuid_generate_v4(), 'Data Entry'),
    (uuid_generate_v4(), 'Accounting'),
    (uuid_generate_v4(), 'Digital Marketing'),
    (uuid_generate_v4(), 'Social Media Marketing'),
    (uuid_generate_v4(), 'Content Writing'),
    
    -- Technical & Trade Skills
    (uuid_generate_v4(), 'Driving'),
    (uuid_generate_v4(), 'Two Wheeler Driving'),
    (uuid_generate_v4(), 'Cooking'),
    (uuid_generate_v4(), 'Food Preparation'),
    (uuid_generate_v4(), 'Cash Handling'),
    (uuid_generate_v4(), 'Inventory Management'),
    (uuid_generate_v4(), 'Basic Computer'),
    (uuid_generate_v4(), 'Tally'),
    (uuid_generate_v4(), 'Photo Editing'),
    (uuid_generate_v4(), 'Video Editing');

-- ============================================================================
-- JOB CATEGORIES DATA (Relevant for Indian local markets)
-- ============================================================================

-- Inserting various job categories
INSERT INTO job_categories (id, name) VALUES 
    (uuid_generate_v4(), 'Information Technology'),
    (uuid_generate_v4(), 'Sales & Marketing'), 
    (uuid_generate_v4(), 'Food & Restaurant'),
    (uuid_generate_v4(), 'Retail & Shop'),
    (uuid_generate_v4(), 'Healthcare'),
    (uuid_generate_v4(), 'Education & Teaching'),
    (uuid_generate_v4(), 'Manufacturing'),
    (uuid_generate_v4(), 'Banking & Finance'),
    (uuid_generate_v4(), 'Customer Service'),
    (uuid_generate_v4(), 'Transportation & Delivery'),
    (uuid_generate_v4(), 'Real Estate'),
    (uuid_generate_v4(), 'Hotel & Tourism'),
    (uuid_generate_v4(), 'Security Services'),
    (uuid_generate_v4(), 'Beauty & Wellness'),
    (uuid_generate_v4(), 'Administrative'),
    (uuid_generate_v4(), 'Construction'),
    (uuid_generate_v4(), 'Agriculture'),
    (uuid_generate_v4(), 'Automotive'),
    (uuid_generate_v4(), 'Government Jobs'),
    (uuid_generate_v4(), 'Freelance & Part-time');

-- ============================================================================
-- SAMPLE COMPANY PROFILES
-- ============================================================================
-- Note: These will be linked to actual user IDs once users register via Google OAuth

-- Inserting sample company profile for a Tech Company
INSERT INTO company_profiles (id, user_id, company_name, company_description, is_verified) VALUES 
    (uuid_generate_v4(), null, 'TechMorena Solutions', 'Leading software development company in Morena specializing in web and mobile applications. We create innovative digital solutions for local businesses.', true);

-- Inserting sample company profile for a Restaurant
INSERT INTO company_profiles (id, user_id, company_name, company_description, is_verified) VALUES 
    (uuid_generate_v4(), null, 'Rajwada Restaurant', 'Popular family restaurant in Gwalior serving authentic North Indian cuisine. Known for our traditional recipes and warm hospitality.', true);

-- Inserting sample company profile for a Retail Store
INSERT INTO company_profiles (id, user_id, company_name, company_description, is_verified) VALUES 
    (uuid_generate_v4(), null, 'Fashion Junction', 'Modern clothing store in Morena offering latest fashion trends for men, women and children. Premium quality at affordable prices.', false);

-- Inserting sample company profile for a Medical Center
INSERT INTO company_profiles (id, user_id, company_name, company_description, is_verified) VALUES 
    (uuid_generate_v4(), null, 'Gwalior Medical Center', 'Multi-specialty healthcare facility providing quality medical services. Equipped with modern equipment and experienced doctors.', true);

-- Inserting sample company profile for an Education Institute
INSERT INTO company_profiles (id, user_id, company_name, company_description, is_verified) VALUES 
    (uuid_generate_v4(), null, 'Bright Future Academy', 'Coaching institute in Morena for competitive exam preparation. Expert faculty with proven track record of success.', false);

-- ============================================================================
-- SAMPLE JOB POSTINGS
-- ============================================================================
-- Note: Company IDs should be replaced with actual company_profile IDs from above

-- Inserting a job posting for a Junior Software Developer
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'TechMorena Solutions' LIMIT 1),
     'Junior Software Developer',
     'We are looking for a passionate Junior Software Developer to join our growing team. Responsibilities include developing web applications, mobile apps, and maintaining existing systems. Fresh graduates with good programming skills are welcome to apply.',
     '18,000-25,000',
     (SELECT id FROM job_categories WHERE name = 'Information Technology' LIMIT 1),
     'morena',
     true);

-- Inserting a job posting for a Waiter/Waitress
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'Rajwada Restaurant' LIMIT 1),
     'Waiter/Waitress',
     'Experienced waiter/waitress needed for busy restaurant. Must have good communication skills, professional attitude, and ability to work in fast-paced environment. Previous restaurant experience preferred.',
     '12,000-15,000',
     (SELECT id FROM job_categories WHERE name = 'Food & Restaurant' LIMIT 1),
     'gwalior',
     true);

-- Inserting a job posting for a Sales Executive
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'Fashion Junction' LIMIT 1),
     'Sales Executive',
     'Dynamic sales executive required for fashion retail store. Must have excellent communication skills, fashion sense, and customer handling experience. Attractive incentives based on sales performance.',
     '15,000-22,000',
     (SELECT id FROM job_categories WHERE name = 'Sales & Marketing' LIMIT 1),
     'morena',
     true);

-- Inserting a job posting for a Front Desk Receptionist
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'Gwalior Medical Center' LIMIT 1),
     'Front Desk Receptionist',
     'Professional receptionist needed for medical center. Responsibilities include patient registration, appointment scheduling, phone handling, and basic computer work. Must be fluent in Hindi and English.',
     '14,000-18,000',
     (SELECT id FROM job_categories WHERE name = 'Healthcare' LIMIT 1),
     'gwalior',
     true);

-- Inserting a job posting for a Mathematics Teacher
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'Bright Future Academy' LIMIT 1),
     'Mathematics Teacher',
     'Experienced mathematics teacher required for competitive exam preparation. Must have strong subject knowledge, teaching experience, and ability to motivate students. Graduate in Mathematics or related field preferred.',
     '20,000-30,000',
     (SELECT id FROM job_categories WHERE name = 'Education & Teaching' LIMIT 1),
     'morena',
     true);

-- Inserting a job posting for a Delivery Executive
INSERT INTO jobs (id, company_id, title, description, salary, category_id, city, is_active) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM company_profiles WHERE company_name = 'TechMorena Solutions' LIMIT 1),
     'Delivery Executive',
     'Reliable delivery executive needed with own two-wheeler. Must know local areas well, have valid driving license, and smartphone for order tracking. Flexible working hours available.',
     '12,000-16,000',
     (SELECT id FROM job_categories WHERE name = 'Transportation & Delivery' LIMIT 1),
     'morena',
     true);

-- ============================================================================
-- SAMPLE JOB SKILLS ASSOCIATIONS (Many-to-Many)
-- ============================================================================

-- Associating skills with the Software Developer Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Junior Software Developer' LIMIT 1), (SELECT id FROM skills WHERE name = 'JavaScript' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Junior Software Developer' LIMIT 1), (SELECT id FROM skills WHERE name = 'HTML/CSS' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Junior Software Developer' LIMIT 1), (SELECT id FROM skills WHERE name = 'Python' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Junior Software Developer' LIMIT 1), (SELECT id FROM skills WHERE name = 'Problem Solving' LIMIT 1));

-- Associating skills with the Waiter Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Waiter/Waitress' LIMIT 1), (SELECT id FROM skills WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Waiter/Waitress' LIMIT 1), (SELECT id FROM skills WHERE name = 'Hindi Communication' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Waiter/Waitress' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1));

-- Associating skills with the Sales Executive Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Sales Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Sales' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Sales Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Sales Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Sales Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Presentation Skills' LIMIT 1));

-- Associating skills with the Receptionist Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Front Desk Receptionist' LIMIT 1), (SELECT id FROM skills WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Front Desk Receptionist' LIMIT 1), (SELECT id FROM skills WHERE name = 'Basic Computer' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Front Desk Receptionist' LIMIT 1), (SELECT id FROM skills WHERE name = 'Hindi Communication' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Front Desk Receptionist' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1));

-- Associating skills with the Teaching Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Mathematics Teacher' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Mathematics Teacher' LIMIT 1), (SELECT id FROM skills WHERE name = 'Hindi Communication' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Mathematics Teacher' LIMIT 1), (SELECT id FROM skills WHERE name = 'Presentation Skills' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Mathematics Teacher' LIMIT 1), (SELECT id FROM skills WHERE skills.name = 'Problem Solving' LIMIT 1));

-- Associating skills with the Delivery Executive Job
INSERT INTO job_skills (job_id, skill_id) VALUES 
    ((SELECT id FROM jobs WHERE title = 'Delivery Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Two Wheeler Driving' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Delivery Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Basic Computer' LIMIT 1)),
    ((SELECT id FROM jobs WHERE title = 'Delivery Executive' LIMIT 1), (SELECT id FROM skills WHERE name = 'Time Management' LIMIT 1));

-- ============================================================================
-- SAMPLE SEEKER PROFILES
-- ============================================================================
-- Note: These will be linked to actual user IDs once users register via Google OAuth

-- Inserting a sample seeker profile for a Fresh Graduate
INSERT INTO seeker_profiles (id, user_id, tenth_percentage, twelfth_percentage, graduation_percentage, experience_level) VALUES 
    (uuid_generate_v4(), null, 85.5, 78.2, 72.8, 'fresher');

-- Inserting a sample seeker profile for an Experienced Professional
INSERT INTO seeker_profiles (id, user_id, tenth_percentage, twelfth_percentage, graduation_percentage, experience_level) VALUES 
    (uuid_generate_v4(), null, 76.0, 82.5, 68.9, 'mid');

-- Inserting a sample seeker profile for an Entry Level
INSERT INTO seeker_profiles (id, user_id, tenth_percentage, twelfth_percentage, graduation_percentage, experience_level) VALUES 
    (uuid_generate_v4(), null, 82.3, 75.8, null, 'entry');

-- ============================================================================
-- SAMPLE APPLICATIONS
-- ============================================================================
-- Note: These will be linked to actual seeker_profile IDs and job IDs

-- Inserting an application with 'applied' status
INSERT INTO applications (id, job_id, seeker_id, message, status) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM jobs WHERE title = 'Junior Software Developer' LIMIT 1),
     (SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1),
     'I am very interested in this position and eager to learn new technologies.',
     'applied');

-- Inserting an application with 'under_review' status
INSERT INTO applications (id, job_id, seeker_id, message, status) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM jobs WHERE title = 'Sales Executive' LIMIT 1),
     (SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1),
     'I have 3 years of sales experience and am confident I can meet your targets.',
     'under_review');

-- Inserting an application with 'hired' status
INSERT INTO applications (id, job_id, seeker_id, message, status) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM jobs WHERE title = 'Front Desk Receptionist' LIMIT 1),
     (SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1),
     'I have good communication skills and am available to start immediately.',
     'hired');

-- Inserting an application with 'rejected' status
INSERT INTO applications (id, job_id, seeker_id, message, status) VALUES 
    (uuid_generate_v4(), 
     (SELECT id FROM jobs WHERE title = 'Mathematics Teacher' LIMIT 1),
     (SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1),
     null,
     'rejected');

-- ============================================================================
-- SAMPLE SEEKER SKILLS ASSOCIATIONS
-- ============================================================================

-- Associating skills with the Fresher Seeker profile
INSERT INTO seeker_skills (seeker_id, skill_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM skills WHERE name = 'JavaScript' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM skills WHERE name = 'HTML/CSS' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM skills WHERE name = 'Microsoft Office' LIMIT 1));

-- Associating skills with the Mid-level Seeker profile
INSERT INTO seeker_skills (seeker_id, skill_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM skills WHERE name = 'Sales' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM skills WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM skills WHERE name = 'Digital Marketing' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM skills WHERE name = 'Team Leadership' LIMIT 1));

-- Associating skills with the Entry-level Seeker profile
INSERT INTO seeker_skills (seeker_id, skill_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM skills WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM skills WHERE name = 'Basic Computer' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM skills WHERE name = 'Hindi Communication' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM skills WHERE name = 'English Communication' LIMIT 1));

-- ============================================================================
-- SAMPLE SEEKER INTERESTED CATEGORIES
-- ============================================================================

-- Associating interested job categories with the Fresher Seeker profile
INSERT INTO seeker_categories (seeker_id, category_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Information Technology' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'fresher' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Administrative' LIMIT 1));

-- Associating interested job categories with the Mid-level Seeker profile
INSERT INTO seeker_categories (seeker_id, category_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Sales & Marketing' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'mid' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Real Estate' LIMIT 1));

-- Associating interested job categories with the Entry-level Seeker profile
INSERT INTO seeker_categories (seeker_id, category_id) VALUES 
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Customer Service' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Healthcare' LIMIT 1)),
    ((SELECT id FROM seeker_profiles WHERE experience_level = 'entry' LIMIT 1), (SELECT id FROM job_categories WHERE name = 'Administrative' LIMIT 1));

-- ============================================================================
-- VERIFICATION QUERIES (Optional - for testing data integrity)
-- ============================================================================

-- Query to check the total number of records in each table
SELECT 'skills' as table_name, COUNT(*) as record_count FROM skills
UNION ALL
SELECT 'job_categories', COUNT(*) FROM job_categories
UNION ALL
SELECT 'company_profiles', COUNT(*) FROM company_profiles
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'seeker_profiles', COUNT(*) FROM seeker_profiles
UNION ALL
SELECT 'applications', COUNT(*) FROM applications
UNION ALL
SELECT 'job_skills', COUNT(*) FROM job_skills
UNION ALL
SELECT 'seeker_skills', COUNT(*) FROM seeker_skills
UNION ALL
SELECT 'seeker_categories', COUNT(*) FROM seeker_categories;