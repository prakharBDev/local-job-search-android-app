import { apiClient, buildJobQuery, buildSearchQuery, handleApiError } from './api';

/**
 * Job Service
 * Handles job-related operations including CRUD, search, and application management
 * Uses centralized API client for consistent error handling and performance optimization
 */
const jobService = {
  /**
   * Get all jobs with optional filters
   * @param {Object} filters - Job filters
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobs(filters = {}, options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        filters,
        includeCompany: true,
        includeCategory: true,
        includeSkills: true,
        limit: options.limit || 20,
        offset: options.offset || 0,
        orderBy: options.orderBy || { column: 'created_at', ascending: false },
        cache: options.cache !== false,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobs');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get job by ID with all related data
   * @param {string} jobId - Job ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobById(jobId, options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        filters: { id: jobId },
        includeCompany: true,
        includeCategory: true,
        includeSkills: true,
        includeApplications: options.includeApplications || false,
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobById');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Create new job
   * @param {Object} jobData - Job data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createJob(jobData) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('jobs')
          .insert([{
            ...jobData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }])
          .select()
          .single();
      };

      const { data, error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache('jobs_');

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'createJob');
      return { data: null, error: normalizedError };
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
      const operation = async (supabase) => {
        return await supabase
          .from('jobs')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', jobId)
          .select()
          .single();
      };

      const { data, error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache('jobs_');

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'updateJob');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Delete job (soft delete by setting is_active to false)
   * @param {string} jobId - Job ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteJob(jobId) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('jobs')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', jobId);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache('jobs_');

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'deleteJob');
      return { error: normalizedError };
    }
  },

  /**
   * Search jobs with text and filters
   * @param {string} searchTerm - Search term
   * @param {Object} filters - Additional filters
   * @param {Object} options - Query options
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async searchJobs(searchTerm, filters = {}, options = {}) {
    try {
      const { data, error } = await buildSearchQuery(searchTerm, {
        searchIn: ['jobs'],
        filters,
        limit: options.limit || 20,
        cache: false, // Don't cache search results
        ...options
      });

      if (error) {
        throw error;
      }

      return { data: data?.jobs || [], error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'searchJobs');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get jobs by company
   * @param {string} companyId - Company ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobsByCompany(companyId, options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        filters: { company_id: companyId },
        includeCategory: true,
        includeSkills: true,
        includeApplications: options.includeApplications || false,
        limit: options.limit || 50,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobsByCompany');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get jobs by category
   * @param {string} categoryId - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobsByCategory(categoryId, options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        filters: { category_id: categoryId },
        includeCompany: true,
        includeSkills: true,
        limit: options.limit || 20,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobsByCategory');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get jobs by city
   * @param {string} city - City name
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobsByCity(city, options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        filters: { city },
        includeCompany: true,
        includeCategory: true,
        includeSkills: true,
        limit: options.limit || 20,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobsByCity');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get recent jobs
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getRecentJobs(options = {}) {
    try {
      const { data, error } = await buildJobQuery({
        includeCompany: true,
        includeCategory: true,
        limit: options.limit || 10,
        orderBy: { column: 'created_at', ascending: false },
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getRecentJobs');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get job statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobStats(filters = {}) {
    try {
      const operation = async (supabase) => {
        const stats = {};

        // Get total jobs
        const { data: totalJobs } = await supabase
          .from('jobs')
          .select('id', { count: 'exact' })
          .eq('is_active', true);

        stats.totalJobs = totalJobs?.length || 0;

        // Get jobs by city
        const { data: jobsByCity } = await supabase
          .from('jobs')
          .select('city')
          .eq('is_active', true);

        stats.jobsByCity = jobsByCity?.reduce((acc, job) => {
          acc[job.city] = (acc[job.city] || 0) + 1;
          return acc;
        }, {}) || {};

        // Get jobs by category
        const { data: jobsByCategory } = await supabase
          .from('jobs')
          .select('category_id, job_categories(name)')
          .eq('is_active', true);

        stats.jobsByCategory = jobsByCategory?.reduce((acc, job) => {
          const categoryName = job.job_categories?.name || 'Unknown';
          acc[categoryName] = (acc[categoryName] || 0) + 1;
          return acc;
        }, {}) || {};

        // Get recent job postings (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: recentJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('is_active', true)
          .gte('created_at', sevenDaysAgo.toISOString());

        stats.recentJobs = recentJobs?.length || 0;

        return { data: stats, error: null };
      };

      const { data, error } = await apiClient.request(operation, {
        cache: true,
        cacheKey: `job_stats_${JSON.stringify(filters)}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobStats');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Add skills to job
   * @param {string} jobId - Job ID
   * @param {Array} skillIds - Array of skill IDs
   * @returns {Promise<{error: Error|null}>}
   */
  async addSkillsToJob(jobId, skillIds) {
    try {
      const operation = async (supabase) => {
        const skillData = skillIds.map(skillId => ({
          job_id: jobId,
          skill_id: skillId,
        }));

        return await supabase
          .from('job_skills')
          .insert(skillData);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache(`jobs_${jobId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'addSkillsToJob');
      return { error: normalizedError };
    }
  },

  /**
   * Remove skills from job
   * @param {string} jobId - Job ID
   * @param {Array} skillIds - Array of skill IDs to remove
   * @returns {Promise<{error: Error|null}>}
   */
  async removeSkillsFromJob(jobId, skillIds) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('job_skills')
          .delete()
          .eq('job_id', jobId)
          .in('skill_id', skillIds);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache(`jobs_${jobId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'removeSkillsFromJob');
      return { error: normalizedError };
    }
  },

  /**
   * Get skills for a specific job
   * @param {string} jobId - Job ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobSkills(jobId) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('job_skills')
          .select(`
            id,
            skills (
              id,
              name
            )
          `)
          .eq('job_id', jobId);
      };

      const { data, error } = await apiClient.request(operation, {
        cache: true,
        retry: true,
      });

      if (error) {
        throw error;
      }

      // Transform the data to return just the skills
      const skills = data?.map(item => ({
        id: item.skills?.id || item.id,
        name: item.skills?.name || 'Unknown Skill'
      })).filter(skill => skill.name !== 'Unknown Skill') || [];

      return { data: skills, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getJobSkills');
      return { data: null, error: normalizedError };
    }
  },
};

export default jobService;