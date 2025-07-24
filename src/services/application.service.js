import { apiClient, buildApplicationQuery, handleApiError } from './api';
import { Application } from '../models';

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
      // First check if user has already applied
      const { data: alreadyApplied, error: checkError } = await this.hasApplied(
        applicationData.seeker_id,
        applicationData.job_id
      );

      if (checkError) {
        console.error('Error checking existing application:', checkError);
      } else if (alreadyApplied) {
        return { 
          data: null, 
          error: new Error('You have already applied for this job. Duplicate applications are not allowed.') 
        };
      }

      const { data, error } = await apiClient.request(
        async () => {
          const insertData = {
            ...applicationData,
            status: 'applied', // Default status
          };
          
          // Simple insert with select
          const { data, error } = await apiClient.supabase
            .from('applications')
            .insert([insertData])
            .select(
              `
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
            `,
            );

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'applyForJob',
        },
      );

      if (error) {
        // Handle unique constraint violation specifically
        if (error.code === '23505' && error.message.includes('applications_job_id_seeker_id_key')) {
          throw new Error('You have already applied for this job. Duplicate applications are not allowed.');
        }
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('applications');
      apiClient.clearCache(`applications_seeker_${applicationData.seeker_id}`);
      apiClient.clearCache(`applications_job_${applicationData.job_id}`);
      apiClient.clearCache(`has_applied_${applicationData.seeker_id}_${applicationData.job_id}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'applyForJob');
      return { data: null, error: apiError };
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
      console.log('=== GET SEEKER APPLICATIONS ===');
      console.log('Seeker ID:', seekerId);
      console.log('Status filter:', status);
      
      const { data, error } = await buildApplicationQuery({
        filters: {
          seeker_id: seekerId,
          ...(status && { status }),
        },
        includeJob: true,
        includeSeeker: false,
        includeCompany: true,
        includeCategory: true,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        cacheKey: `applications_seeker_${seekerId}_${status || 'all'}`,
      });

      console.log('Applications data:', data);
      console.log('Applications error:', error);

      if (error) {
        throw error;
      }

      console.log('=== END GET SEEKER APPLICATIONS ===');
      return { data, error: null };
    } catch (error) {
      console.error('Error in getSeekerApplications:', error);
      const apiError = handleApiError(error, 'getSeekerApplications');
      return { data: null, error: apiError };
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
      const { data, error } = await buildApplicationQuery({
        filters: {
          job_id: jobId,
          ...(status && { status }),
        },
        includeJob: false,
        includeSeeker: true,
        includeCompany: false,
        includeCategory: false,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        cacheKey: `applications_job_${jobId}_${status || 'all'}`,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getJobApplications');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get single application with full details
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getApplication(applicationId) {
    try {
      const { data, error } = await buildApplicationQuery({
        filters: { id: applicationId },
        includeJob: true,
        includeSeeker: true,
        includeCompany: true,
        includeCategory: true,
        cache: true,
        cacheKey: `application_${applicationId}`,
      });

      if (error) {
        throw error;
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getApplication');
      return { data: null, error: apiError };
    }
  },

  /**
   * Update application status
   * @param {string} applicationId - Application ID
   * @param {string} status - New status
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .update({
              status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', applicationId)
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'updateApplicationStatus',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('applications');
      apiClient.clearCache(`application_${applicationId}`);
      if (data?.seeker_id) {
        apiClient.clearCache(`applications_seeker_${data.seeker_id}`);
      }
      if (data?.job_id) {
        apiClient.clearCache(`applications_job_${data.job_id}`);
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateApplicationStatus');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get applications for a specific job
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getApplicationsByJob(jobId) {
    try {
      const { data, error } = await buildApplicationQuery({
        filters: { job_id: jobId },
        includeJob: false,
        includeSeeker: true,
        includeCompany: false,
        includeCategory: false,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        cacheKey: `applications_job_${jobId}`,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getApplicationsByJob');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get all applications for a company
   * @param {string} companyId - Company ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getApplicationsByCompany(companyId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .select(
              `
              *,
              jobs(
                id,
                title,
                city,
                job_type,
                created_at
              ),
              seeker_profiles(
                id,
                experience_level,
                tenth_percentage,
                twelfth_percentage,
                graduation_percentage,
                users(
                  id,
                  name,
                  email,
                  phone_number
                )
              )
            `,
            )
            .eq('jobs.company_id', companyId)
            .order('created_at', { ascending: false });

          return { data, error };
        },
        {
          cache: true,
          cacheKey: `applications_company_${companyId}`,
          context: 'getApplicationsByCompany',
        },
      );

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getApplicationsByCompany');
      return { data: null, error: apiError };
    }
  },

  /**
   * Check if a seeker has already applied for a job
   * @param {string} seekerId - Seeker profile ID
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: boolean, error: Error|null}>}
   */
  async hasApplied(seekerId, jobId) {
    try {
      const { data, error } = await apiClient.query('applications', {
        select: 'id',
        filters: {
          seeker_id: seekerId,
          job_id: jobId,
        },
        limit: 1,
        cache: true,
        cacheKey: `has_applied_${seekerId}_${jobId}`,
      });

      if (error) {
        throw error;
      }

      return { data: data && data.length > 0, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'hasApplied');
      return { data: false, error: apiError };
    }
  },

  /**
   * Withdraw an application
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async withdrawApplication(applicationId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .update({
              status: 'withdrawn',
              updated_at: new Date().toISOString(),
            })
            .eq('id', applicationId)
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'withdrawApplication',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('applications');
      apiClient.clearCache(`application_${applicationId}`);
      if (data?.seeker_id) {
        apiClient.clearCache(`applications_seeker_${data.seeker_id}`);
      }
      if (data?.job_id) {
        apiClient.clearCache(`applications_job_${data.job_id}`);
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'withdrawApplication');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get applications for a company with filters
   * @param {string} companyId - Company ID
   * @param {Object} filters - Additional filters
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCompanyApplications(companyId, filters = {}) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          let query = apiClient.supabase
            .from('applications')
            .select(
              `
              *,
              jobs(
                id,
                title,
                city,
                job_type,
                created_at
              ),
              seeker_profiles(
                id,
                experience_level,
                expected_salary,
                users(name, email, city)
              )
            `,
            )
            .eq('jobs.company_id', companyId)
            .order('created_at', { ascending: false });

          // Apply additional filters
          if (filters.status) {
            query = query.eq('status', filters.status);
          }
          if (filters.jobId) {
            query = query.eq('job_id', filters.jobId);
          }
          if (filters.limit) {
            query = query.limit(filters.limit);
          }

          const { data, error } = await query;
          return { data, error };
        },
        {
          cache: true,
          cacheKey: `applications_company_${companyId}_${JSON.stringify(
            filters,
          )}`,
          context: 'getCompanyApplications',
        },
      );

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompanyApplications');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get application statistics for a job
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobApplicationStats(jobId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .select('status')
            .eq('job_id', jobId);

          return { data, error };
        },
        {
          cache: true,
          cacheKey: `job_stats_${jobId}`,
          context: 'getJobApplicationStats',
        },
      );

      if (error) {
        throw error;
      }

      // Calculate statistics
      const stats = {
        total: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        reviewed: data.filter(app => app.status === 'reviewed').length,
        shortlisted: data.filter(app => app.status === 'shortlisted').length,
        rejected: data.filter(app => app.status === 'rejected').length,
        withdrawn: data.filter(app => app.status === 'withdrawn').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getJobApplicationStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get application statistics for a seeker
   * @param {string} seekerId - Seeker profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerApplicationStats(seekerId) {
    try {
      console.log('=== GET SEEKER APPLICATION STATS ===');
      console.log('Seeker ID:', seekerId);
      
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .select('status, created_at')
            .eq('seeker_id', seekerId);

          return { data, error };
        },
        {
          cache: true,
          cacheKey: `seeker_stats_${seekerId}`,
          context: 'getSeekerApplicationStats',
        },
      );

      console.log('Raw applications data:', data);
      console.log('Raw applications error:', error);

      if (error) {
        throw error;
      }

      // Calculate statistics
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const stats = {
        total: data.length,
        applied: data.filter(app => app.status === 'applied').length,
        under_review: data.filter(app => app.status === 'under_review').length,
        hired: data.filter(app => app.status === 'hired').length,
        rejected: data.filter(app => app.status === 'rejected').length,
        recent: data.filter(app => new Date(app.created_at) >= thirtyDaysAgo)
          .length,
      };

      console.log('Calculated stats:', stats);
      console.log('=== END GET SEEKER APPLICATION STATS ===');

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getSeekerApplicationStats:', error);
      const apiError = handleApiError(error, 'getSeekerApplicationStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get recent applications
   * @param {number} limit - Number of applications to return
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getRecentApplications(limit = 10, city = null) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          let query = apiClient.supabase
            .from('applications')
            .select(
              `
              *,
              jobs(
                id,
                title,
                city,
                company_profiles(company_name)
              ),
              seeker_profiles(
                users(name)
              )
            `,
            )
            .order('created_at', { ascending: false })
            .limit(limit);

          if (city) {
            query = query.eq('jobs.city', city);
          }

          const { data, error } = await query;
          return { data, error };
        },
        {
          cache: true,
          cacheKey: `recent_applications_${limit}_${city || 'all'}`,
          context: 'getRecentApplications',
        },
      );

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getRecentApplications');
      return { data: null, error: apiError };
    }
  },

  /**
   * Delete an application (admin only)
   * @param {string} applicationId - Application ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async deleteApplication(applicationId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .delete()
            .eq('id', applicationId)
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'deleteApplication',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('applications');
      apiClient.clearCache(`application_${applicationId}`);
      if (data?.seeker_id) {
        apiClient.clearCache(`applications_seeker_${data.seeker_id}`);
      }
      if (data?.job_id) {
        apiClient.clearCache(`applications_job_${data.job_id}`);
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'deleteApplication');
      return { data: null, error: apiError };
    }
  },
};

export default applicationService;
