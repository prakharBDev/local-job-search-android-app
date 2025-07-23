import { supabase } from '../utils/supabase';

/**
 * Application Service
 * Handles job application operations, status management, and application tracking
 */
const applicationService = {
  /**
   * Apply for a job
   * @param {Object} applicationData - Application data including seeker_id, job_id, cover_letter
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async applyForJob(applicationData) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([{
          ...applicationData,
          status: 'applied', // Default status
          applied_at: new Date().toISOString(),
        }])
        .select(`
          *,
          jobs(
            id,
            title,
            company_id,
            city,
            company_profiles(
              id,
              company_name,
              is_verified
            )
          ),
          seeker_profiles(
            id,
            experience_level,
            users(name, email)
          )
        `)
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
   * @param {string} seekerId - Seeker profile ID
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSeekerApplications(seekerId, status = null) {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs(
            id,
            title,
            description,
            salary_range,
            city,
            job_type,
            created_at,
            company_profiles(
              id,
              company_name,
              company_description,
              is_verified
            ),
            job_categories(id, name)
          )
        `)
        .eq('seeker_id', seekerId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

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
   * @param {string} jobId - Job ID
   * @param {string} status - Filter by status (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobApplications(jobId, status = null) {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          seeker_profiles(
            id,
            experience_level,
            bio,
            expected_salary,
            users(
              name,
              email,
              phone,
              city
            ),
            seeker_skills(
              skill_id,
              skills(id, name)
            )
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

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
   * Get single application with full details
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getApplication(applicationId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs(
            id,
            title,
            description,
            salary_range,
            city,
            job_type,
            company_profiles(
              id,
              company_name,
              company_description,
              is_verified,
              users(name, email, phone)
            ),
            job_categories(id, name),
            job_skills(
              skill_id,
              skills(id, name)
            )
          ),
          seeker_profiles(
            id,
            experience_level,
            bio,
            expected_salary,
            users(name, email, phone, city)
          )
        `)
        .eq('id', applicationId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching application:', error);
      return { data: null, error };
    }
  },

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} status - New status ('applied', 'under_review', 'hired', 'rejected')
   * @param {string} updatedBy - User ID who updated the status
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateApplicationStatus(applicationId, status, updatedBy) {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      };

      // Set status-specific timestamps
      if (status === 'under_review') {
        updateData.reviewed_at = new Date().toISOString();
      } else if (status === 'hired') {
        updateData.hired_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId)
        .select(`
          *,
          jobs(
            id,
            title,
            company_profiles(
              id,
              company_name,
              is_verified
            )
          ),
          seeker_profiles(
            id,
            users(name, email)
          )
        `)
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
   * Check if user has already applied for a job
   * @param {string} seekerId - Seeker profile ID
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: boolean, error: Error|null}>}
   */
  async hasApplied(seekerId, jobId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('seeker_id', seekerId)
        .eq('job_id', jobId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data: !!data, error: null };
    } catch (error) {
      console.error('Error checking application status:', error);
      return { data: false, error };
    }
  },

  /**
   * Withdraw application
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async withdrawApplication(applicationId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({
          status: 'withdrawn',
          withdrawn_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error withdrawing application:', error);
      return { data: null, error };
    }
  },

  /**
   * Get applications by company
   * @param {string} companyId - Company profile ID
   * @param {Object} filters - Filter options (status, limit, offset)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCompanyApplications(companyId, filters = {}) {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(
            id,
            title,
            company_id
          ),
          seeker_profiles(
            id,
            experience_level,
            bio,
            expected_salary,
            users(name, email, phone, city)
          )
        `)
        .eq('jobs.company_id', companyId)
        .order('created_at', { ascending: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching company applications:', error);
      return { data: null, error };
    }
  },

  /**
   * Get application statistics for a job
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobApplicationStats(jobId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status, created_at')
        .eq('job_id', jobId);

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        underReview: data.filter(app => app.status === 'under_review').length,
        hired: data.filter(app => app.status === 'hired').length,
        rejected: data.filter(app => app.status === 'rejected').length,
        withdrawn: data.filter(app => app.status === 'withdrawn').length,
        recentApplications: data.filter(app => {
          const appDate = new Date(app.created_at);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return appDate >= sevenDaysAgo;
        }).length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching job application stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get application statistics for a seeker
   * @param {string} seekerId - Seeker profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerApplicationStats(seekerId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status, created_at')
        .eq('seeker_id', seekerId);

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        underReview: data.filter(app => app.status === 'under_review').length,
        hired: data.filter(app => app.status === 'hired').length,
        rejected: data.filter(app => app.status === 'rejected').length,
        withdrawn: data.filter(app => app.status === 'withdrawn').length,
        successRate: data.length > 0 ? ((data.filter(app => app.status === 'hired').length / data.length) * 100).toFixed(1) : 0,
        activeApplications: data.filter(app => ['applied', 'under_review'].includes(app.status)).length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching seeker application stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get recent applications (for dashboard/analytics)
   * @param {number} limit - Number of recent applications (default: 10)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getRecentApplications(limit = 10, city = null) {
    try {
      let query = supabase
        .from('applications')
        .select(`
          *,
          jobs(
            id,
            title,
            city,
            company_profiles(
              id,
              company_name,
              is_verified
            )
          ),
          seeker_profiles(
            id,
            experience_level,
            users(name, city)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (city) {
        query = query.eq('jobs.city', city);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete application (rarely used, mostly for cleanup)
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async deleteApplication(applicationId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting application:', error);
      return { data: null, error };
    }
  },
};

export default applicationService;