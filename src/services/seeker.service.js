import { apiClient, buildSeekerProfileQuery, handleApiError } from './api';

/**
 * Seeker Service
 * Handles job seeker profile operations, skills management, and categories
 * Uses centralized API client for consistent error handling and performance optimization
 */
const seekerService = {
  /**
   * Create a new seeker profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createSeekerProfile(userId, profileData) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('seeker_profiles')
          .insert([{
            user_id: userId,
            ...profileData,
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
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'createSeekerProfile');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Update seeker profile
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateSeekerProfile(userId, updates) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('seeker_profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
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
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'updateSeekerProfile');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get seeker profile by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerProfile(userId, options = {}) {
    try {
      const { data, error } = await buildSeekerProfileQuery(userId, {
        includeSkills: true,
        includeCategories: true,
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      // Handle array response - return first item or null if no profile exists
      const profile = Array.isArray(data) ? data[0] || null : data;
      
      return { data: profile, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getSeekerProfile');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get seeker profile with relations by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerProfileWithRelations(userId, options = {}) {
    try {
      const { data, error } = await buildSeekerProfileQuery(userId, {
        includeSkills: true,
        includeCategories: true,
        includeApplications: options.includeApplications || false,
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      // Handle array response - return first item or null if no profile exists
      const profile = Array.isArray(data) ? data[0] || null : data;
      
      return { data: profile, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getSeekerProfileWithRelations');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Add skills to seeker profile
   * @param {string} userId - User ID
   * @param {Array} skillIds - Array of skill IDs
   * @returns {Promise<{error: Error|null}>}
   */
  async addSeekerSkills(userId, skillIds) {
    try {
      // First get the seeker profile ID
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        throw new Error('Seeker profile not found');
      }

      const operation = async (supabase) => {
        const skillData = skillIds.map(skillId => ({
          seeker_id: profile.id,
          skill_id: skillId,
        }));

        return await supabase
          .from('seeker_skills')
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
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'addSeekerSkills');
      return { error: normalizedError };
    }
  },

  /**
   * Remove skills from seeker profile
   * @param {string} userId - User ID
   * @param {Array} skillIds - Array of skill IDs to remove
   * @returns {Promise<{error: Error|null}>}
   */
  async removeSeekerSkills(userId, skillIds) {
    try {
      // First get the seeker profile ID
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        throw new Error('Seeker profile not found');
      }

      const operation = async (supabase) => {
        return await supabase
          .from('seeker_skills')
          .delete()
          .eq('seeker_id', profile.id)
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
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'removeSeekerSkills');
      return { error: normalizedError };
    }
  },

  /**
   * Add categories to seeker profile
   * @param {string} userId - User ID
   * @param {Array} categoryIds - Array of category IDs
   * @returns {Promise<{error: Error|null}>}
   */
  async addSeekerCategories(userId, categoryIds) {
    try {
      // First get the seeker profile ID
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        throw new Error('Seeker profile not found');
      }

      const operation = async (supabase) => {
        const categoryData = categoryIds.map(categoryId => ({
          seeker_id: profile.id,
          category_id: categoryId,
        }));

        return await supabase
          .from('seeker_categories')
          .insert(categoryData);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'addSeekerCategories');
      return { error: normalizedError };
    }
  },

  /**
   * Remove categories from seeker profile
   * @param {string} userId - User ID
   * @param {Array} categoryIds - Array of category IDs to remove
   * @returns {Promise<{error: Error|null}>}
   */
  async removeSeekerCategories(userId, categoryIds) {
    try {
      // First get the seeker profile ID
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        throw new Error('Seeker profile not found');
      }

      const operation = async (supabase) => {
        return await supabase
          .from('seeker_categories')
          .delete()
          .eq('seeker_id', profile.id)
          .in('category_id', categoryIds);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache(`seeker_profile_${userId}`);

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'removeSeekerCategories');
      return { error: normalizedError };
    }
  },

  /**
   * Get seeker skills
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSeekerSkills(userId) {
    try {
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        return { data: [], error: null };
      }

      const { data, error } = await apiClient.query('seeker_skills', {
        select: 'skill_id, skills(id, name)',
        filters: { seeker_id: profile.id },
        cache: true,
        cacheKey: `seeker_skills_${userId}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getSeekerSkills');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get seeker categories
   * @param {string} userId - User ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSeekerCategories(userId) {
    try {
      const { data: profile } = await this.getSeekerProfile(userId);
      
      if (!profile) {
        return { data: [], error: null };
      }

      const { data, error } = await apiClient.query('seeker_categories', {
        select: 'category_id, job_categories(id, name)',
        filters: { seeker_id: profile.id },
        cache: true,
        cacheKey: `seeker_categories_${userId}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getSeekerCategories');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Search seekers with filters
   * @param {Object} filters - Search filters
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchSeekers(filters = {}, options = {}) {
    try {
      const { data, error } = await apiClient.query('seeker_profiles', {
        select: `
          *,
          users(id, name, email),
          seeker_skills(skill_id, skills(id, name)),
          seeker_categories(category_id, job_categories(id, name))
        `,
        filters,
        orderBy: { column: 'created_at', ascending: false },
        limit: options.limit || 20,
        offset: options.offset || 0,
        cache: options.cache !== false,
        cacheKey: `seekers_search_${JSON.stringify({ filters, options })}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'searchSeekers');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get seeker statistics
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerStats(userId) {
    try {
      const operation = async (supabase) => {
        const stats = {};

        // Get basic profile info
        const { data: profile } = await supabase
          .from('seeker_profiles')
          .select('created_at, experience_level')
          .eq('user_id', userId)
          .single();

        if (profile) {
          stats.createdAt = profile.created_at;
          stats.experienceLevel = profile.experience_level;
          stats.daysSinceCreation = Math.floor((Date.now() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24));
        }

        // Get applications stats
        const { data: applications } = await supabase
          .from('applications')
          .select('status')
          .eq('seeker_id', userId);

        stats.totalApplications = applications?.length || 0;
        stats.applicationsByStatus = applications?.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {}) || {};

        // Get skills count
        const { data: skills } = await supabase
          .from('seeker_skills')
          .select('skill_id')
          .eq('seeker_id', userId);

        stats.totalSkills = skills?.length || 0;

        // Get categories count
        const { data: categories } = await supabase
          .from('seeker_categories')
          .select('category_id')
          .eq('seeker_id', userId);

        stats.totalCategories = categories?.length || 0;

        return { data: stats, error: null };
      };

      const { data, error } = await apiClient.request(operation, {
        cache: true,
        cacheKey: `seeker_stats_${userId}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getSeekerStats');
      return { data: null, error: normalizedError };
    }
  },
};

export default seekerService;