import { supabase } from './supabase';

// ============ USER OPERATIONS ============

export const userService = {
  /**
   * Get user profile with seeker and company profiles
   */
  async getUserProfile(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(
          `
          *,
          seeker_profiles(*),
          company_profiles(*)
        `,
        )
        .eq('id', userId)
        .single();

      if (userError) {
        throw userError;
      }
      return { data: user, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user basic information
   */
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error updating last login:', error);
      return { error };
    }
  },
};

// ============ SEEKER PROFILE OPERATIONS ============

export const seekerService = {
  /**
   * Create a new seeker profile
   */
  async createSeekerProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .insert([
          {
            user_id: userId,
            ...profileData,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Update seeker profile
   */
  async updateSeekerProfile(seekerId, updates) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .update(updates)
        .eq('id', seekerId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Get seeker profile with skills and categories
   */
  async getSeekerProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .select(
          `
          *,
          seeker_skills(
            skill_id,
            skills(id, name)
          ),
          seeker_categories(
            category_id,
            job_categories(id, name)
          )
        `,
        )
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Add skills to seeker profile
   */
  async addSeekerSkills(seekerId, skillIds) {
    try {
      const skillsData = skillIds.map(skillId => ({
        seeker_id: seekerId,
        skill_id: skillId,
      }));

      const { data, error } = await supabase
        .from('seeker_skills')
        .insert(skillsData)
        .select();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error adding seeker skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove skills from seeker profile
   */
  async removeSeekerSkills(seekerId, skillIds) {
    try {
      const { error } = await supabase
        .from('seeker_skills')
        .delete()
        .eq('seeker_id', seekerId)
        .in('skill_id', skillIds);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error removing seeker skills:', error);
      return { error };
    }
  },

  /**
   * Add categories to seeker profile
   */
  async addSeekerCategories(seekerId, categoryIds) {
    try {
      const categoriesData = categoryIds.map(categoryId => ({
        seeker_id: seekerId,
        category_id: categoryId,
      }));

      const { data, error } = await supabase
        .from('seeker_categories')
        .insert(categoriesData)
        .select();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error adding seeker categories:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove categories from seeker profile
   */
  async removeSeekerCategories(seekerId, categoryIds) {
    try {
      const { error } = await supabase
        .from('seeker_categories')
        .delete()
        .eq('seeker_id', seekerId)
        .in('category_id', categoryIds);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error removing seeker categories:', error);
      return { error };
    }
  },
};

// ============ COMPANY PROFILE OPERATIONS ============

export const companyService = {
  /**
   * Create a new company profile
   */
  async createCompanyProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .insert([
          {
            user_id: userId,
            ...profileData,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating company profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Update company profile
   */
  async updateCompanyProfile(companyId, updates) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .update(updates)
        .eq('id', companyId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating company profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Get company profile by user ID
   */
  async getCompanyProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return { data: null, error };
    }
  },
};

// ============ JOB OPERATIONS ============

export const jobService = {
  /**
   * Create a new job posting
   */
  async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select(
          `
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name)
        `,
        )
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating job:', error);
      return { data: null, error };
    }
  },

  /**
   * Get jobs with filters
   */
  async getJobs(filters = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select(
          `
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name),
          job_skills(
            skill_id,
            skills(id, name)
          )
        `,
        )
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return { data: null, error };
    }
  },

  /**
   * Get single job with full details
   */
  async getJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(
          `
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified,
            users(name, email)
          ),
          job_categories(id, name),
          job_skills(
            skill_id,
            skills(id, name)
          )
        `,
        )
        .eq('id', jobId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching job:', error);
      return { data: null, error };
    }
  },

  /**
   * Update job
   */
  async updateJob(jobId, updates) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select(
          `
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name)
        `,
        )
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating job:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete job (soft delete by setting is_active to false)
   */
  async deleteJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ is_active: false })
        .eq('id', jobId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting job:', error);
      return { data: null, error };
    }
  },

  /**
   * Get jobs posted by a company
   */
  async getCompanyJobs(companyId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(
          `
          *,
          job_categories(id, name),
          applications(
            id,
            status,
            created_at,
            seeker_profiles(
              id,
              experience_level,
              users(name, email)
            )
          )
        `,
        )
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching company jobs:', error);
      return { data: null, error };
    }
  },

  /**
   * Add skills to job
   */
  async addJobSkills(jobId, skillIds) {
    try {
      const skillsData = skillIds.map(skillId => ({
        job_id: jobId,
        skill_id: skillId,
      }));

      const { data, error } = await supabase
        .from('job_skills')
        .insert(skillsData)
        .select();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error adding job skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove skills from job
   */
  async removeJobSkills(jobId, skillIds) {
    try {
      const { error } = await supabase
        .from('job_skills')
        .delete()
        .eq('job_id', jobId)
        .in('skill_id', skillIds);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error removing job skills:', error);
      return { error };
    }
  },
};

// ============ APPLICATION OPERATIONS ============

export const applicationService = {
  /**
   * Apply for a job
   */
  async applyForJob(jobId, seekerId, message = null) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            job_id: jobId,
            seeker_id: seekerId,
            message,
            status: 'applied',
          },
        ])
        .select(
          `
          *,
          jobs(
            id,
            title,
            company_profiles(company_name)
          )
        `,
        )
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error applying for job:', error);
      return { data: null, error };
    }
  },

  /**
   * Get applications for a seeker
   */
  async getSeekerApplications(seekerId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(
          `
          *,
          jobs(
            id,
            title,
            description,
            salary,
            city,
            is_active,
            company_profiles(
              id,
              company_name,
              is_verified
            ),
            job_categories(id, name)
          )
        `,
        )
        .eq('seeker_id', seekerId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker applications:', error);
      return { data: null, error };
    }
  },

  /**
   * Get applications for a job
   */
  async getJobApplications(jobId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(
          `
          *,
          seeker_profiles(
            id,
            experience_level,
            tenth_percentage,
            twelfth_percentage,
            graduation_percentage,
            users(name, email),
            seeker_skills(
              skill_id,
              skills(id, name)
            )
          )
        `,
        )
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return { data: null, error };
    }
  },

  /**
   * Update application status
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId)
        .select(
          `
          *,
          jobs(
            id,
            title,
            company_profiles(company_name)
          ),
          seeker_profiles(
            users(name, email)
          )
        `,
        )
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { data: null, error };
    }
  },

  /**
   * Check if user has applied for a job
   */
  async hasApplied(jobId, seekerId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id, status')
        .eq('job_id', jobId)
        .eq('seeker_id', seekerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      } // PGRST116 is "no rows returned"
      return { data, error: null };
    } catch (error) {
      console.error('Error checking application status:', error);
      return { data: null, error };
    }
  },
};

// ============ SKILLS OPERATIONS ============

export const skillsService = {
  /**
   * Get all skills
   */
  async getAllSkills() {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new skill
   */
  async createSkill(name) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating skill:', error);
      return { data: null, error };
    }
  },

  /**
   * Search skills by name
   */
  async searchSkills(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')
        .limit(20);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error searching skills:', error);
      return { data: null, error };
    }
  },
};

// ============ CATEGORIES OPERATIONS ============

export const categoriesService = {
  /**
   * Get all job categories
   */
  async getAllCategories() {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new category
   */
  async createCategory(name) {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating category:', error);
      return { data: null, error };
    }
  },
};

// ============ DASHBOARD/ANALYTICS OPERATIONS ============

export const analyticsService = {
  /**
   * Get dashboard stats for job seekers
   */
  async getSeekerDashboardStats(seekerId) {
    try {
      // Get applications count by status
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('status')
        .eq('seeker_id', seekerId);

      if (appError) {
        throw appError;
      }

      const stats = {
        totalApplications: applications.length,
        applied: applications.filter(app => app.status === 'applied').length,
        underReview: applications.filter(app => app.status === 'under_review')
          .length,
        hired: applications.filter(app => app.status === 'hired').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching seeker dashboard stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get dashboard stats for companies
   */
  async getCompanyDashboardStats(companyId) {
    try {
      // Get jobs count
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, is_active')
        .eq('company_id', companyId);

      if (jobsError) {
        throw jobsError;
      }

      // Get applications count
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('status, jobs!inner(company_id)')
        .eq('jobs.company_id', companyId);

      if (appError) {
        throw appError;
      }

      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.is_active).length,
        inactiveJobs: jobs.filter(job => !job.is_active).length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(
          app => app.status === 'applied',
        ).length,
        underReview: applications.filter(app => app.status === 'under_review')
          .length,
        hired: applications.filter(app => app.status === 'hired').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching company dashboard stats:', error);
      return { data: null, error };
    }
  },
};

// Export all services
export default {
  userService,
  seekerService,
  companyService,
  jobService,
  applicationService,
  skillsService,
  categoriesService,
  analyticsService,
};
