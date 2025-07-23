import { supabase } from '../utils/supabase';

/**
 * Job Service
 * Handles job posting operations, job search, filtering, and job-skill relationships
 */
const jobService = {
  /**
   * Create a new job posting
   * @param {Object} jobData - Job data including company_id, title, description, etc.
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createJob(jobData) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          is_active: true, // Default to active
        }])
        .select(`
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name)
        `)
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
   * Get jobs with filters and search
   * @param {Object} filters - Filter options (city, category_id, company_id, search)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobs(filters = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select(`
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
        `)
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
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
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
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
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
          ),
          applications(
            id,
            status,
            created_at
          )
        `)
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
   * @param {string} jobId - Job ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateJob(jobId, updates) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', jobId)
        .select(`
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name)
        `)
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
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async deleteJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString(),
        })
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
   * @param {string} companyId - Company profile ID
   * @param {boolean} includeInactive - Include inactive jobs (default: false)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCompanyJobs(companyId, includeInactive = false) {
    try {
      let query = supabase
        .from('jobs')
        .select(`
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
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

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
   * Get featured/recommended jobs for a user
   * @param {string} userId - User ID
   * @param {number} limit - Number of jobs to return (default: 10)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getFeaturedJobs(userId, limit = 10) {
    try {
      // This could be enhanced with AI recommendations based on user profile
      // For now, we'll return recent jobs from verified companies
      const { data, error } = await supabase
        .from('jobs')
        .select(`
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
        `)
        .eq('is_active', true)
        .eq('company_profiles.is_verified', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
      return { data: null, error };
    }
  },

  /**
   * Get similar jobs based on job category and skills
   * @param {string} jobId - Current job ID
   * @param {number} limit - Number of similar jobs to return (default: 5)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSimilarJobs(jobId, limit = 5) {
    try {
      // First get the current job's category
      const { data: currentJob, error: jobError } = await supabase
        .from('jobs')
        .select('category_id, company_id')
        .eq('id', jobId)
        .single();

      if (jobError) {
        throw jobError;
      }

      // Get jobs in the same category, excluding the current job and same company
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name)
        `)
        .eq('is_active', true)
        .eq('category_id', currentJob.category_id)
        .neq('id', jobId)
        .neq('company_id', currentJob.company_id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
      return { data: null, error };
    }
  },

  /**
   * Add skills to job
   * @param {string} jobId - Job ID
   * @param {Array<string>} skillIds - Array of skill IDs
   * @returns {Promise<{data: Array|null, error: Error|null}>}
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
        .select(`
          skill_id,
          skills(id, name)
        `);

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
   * @param {string} jobId - Job ID
   * @param {Array<string>} skillIds - Array of skill IDs to remove
   * @returns {Promise<{error: Error|null}>}
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

  /**
   * Get job skills
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobSkills(jobId) {
    try {
      const { data, error } = await supabase
        .from('job_skills')
        .select(`
          skill_id,
          skills(id, name)
        `)
        .eq('job_id', jobId);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching job skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Search jobs by skills
   * @param {Array<string>} skillIds - Array of skill IDs
   * @param {Object} additionalFilters - Additional filters (city, etc.)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchJobsBySkills(skillIds, additionalFilters = {}) {
    try {
      let query = supabase
        .from('jobs')
        .select(`
          *,
          company_profiles(
            id,
            company_name,
            company_description,
            is_verified
          ),
          job_categories(id, name),
          job_skills!inner(
            skill_id,
            skills(id, name)
          )
        `)
        .eq('is_active', true)
        .in('job_skills.skill_id', skillIds);

      // Apply additional filters
      if (additionalFilters.city) {
        query = query.eq('city', additionalFilters.city);
      }
      if (additionalFilters.category_id) {
        query = query.eq('category_id', additionalFilters.category_id);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error searching jobs by skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Get job statistics
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobStatistics(jobId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status')
        .eq('job_id', jobId);

      if (error) {
        throw error;
      }

      const stats = {
        totalApplications: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        underReview: data.filter(app => app.status === 'under_review').length,
        hired: data.filter(app => app.status === 'hired').length,
        rejected: data.filter(app => app.status === 'rejected').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching job statistics:', error);
      return { data: null, error };
    }
  },
};

export default jobService;