import { apiClient, buildProfileQuery, handleApiError } from './api';

/**
 * User Service
 * Handles user profile operations, authentication updates, and basic user management
 * Uses centralized API client for consistent error handling and performance optimization
 */
const userService = {
  /**
   * Get user profile with seeker and company profiles
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUserProfile(userId, options = {}) {
    try {
      const { data, error } = await buildProfileQuery(userId, {
        includeSeeker: true,
        includeCompany: true,
        cache: true,
        ...options
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getUserProfile');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Update user basic information
   * @param {string} userId - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateUser(userId, updates) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('users')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();
      };

      const { data, error } = await apiClient.request(operation, {
        cache: false, // Don't cache updates
        retry: false, // Don't retry update operations
      });

      if (error) {
        throw error;
      }

      // Clear related cache entries
      apiClient.clearCache(`user_profile_${userId}`);

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'updateUser');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Update user's last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<{error: Error|null}>}
   */
  async updateLastLogin(userId) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('users')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', userId);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'updateLastLogin');
      return { error: normalizedError };
    }
  },

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUserByEmail(email) {
    try {
      const { data, error } = await apiClient.query('users', {
        select: '*',
        filters: { email },
        cache: true,
        cacheKey: `user_email_${email}`
      });

      if (error) {
        throw error;
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getUserByEmail');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get user by Google ID
   * @param {string} googleId - Google user ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUserByGoogleId(googleId) {
    try {
      const { data, error } = await apiClient.query('users', {
        select: '*',
        filters: { google_id: googleId },
        cache: true,
        cacheKey: `user_google_${googleId}`
      });

      if (error) {
        throw error;
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getUserByGoogleId');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createUser(userData) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('users')
          .insert([{
            ...userData,
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

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'createUser');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Delete user (soft delete by setting is_active to false)
   * @param {string} userId - User ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteUser(userId) {
    try {
      const operation = async (supabase) => {
        return await supabase
          .from('users')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
      };

      const { error } = await apiClient.request(operation, {
        cache: false,
        retry: false,
      });

      if (error) {
        throw error;
      }

      // Clear all user-related cache
      apiClient.clearCache();

      return { error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'deleteUser');
      return { error: normalizedError };
    }
  },

  /**
   * Search users with filters
   * @param {Object} filters - Search filters
   * @param {Object} options - Query options
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchUsers(filters = {}, options = {}) {
    try {
      const { data, error } = await apiClient.query('users', {
        select: '*',
        filters: { is_active: true, ...filters },
        orderBy: { column: 'created_at', ascending: false },
        limit: options.limit || 50,
        offset: options.offset || 0,
        cache: options.cache !== false,
        cacheKey: `users_search_${JSON.stringify({ filters, options })}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'searchUsers');
      return { data: null, error: normalizedError };
    }
  },

  /**
   * Get user statistics
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUserStats(userId) {
    try {
      const operation = async (supabase) => {
        const stats = {};

        // Get basic user info
        const { data: user } = await supabase
          .from('users')
          .select('created_at, last_login_at')
          .eq('id', userId)
          .single();

        if (user) {
          stats.createdAt = user.created_at;
          stats.lastLoginAt = user.last_login_at;
          stats.daysSinceCreation = Math.floor((Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
        }

        // Get seeker profile stats if exists
        const { data: seekerProfile } = await supabase
          .from('seeker_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (seekerProfile) {
          const { data: applications } = await supabase
            .from('applications')
            .select('status')
            .eq('seeker_id', seekerProfile.id);

          stats.totalApplications = applications?.length || 0;
          stats.applicationsByStatus = applications?.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {}) || {};
        }

        // Get company profile stats if exists
        const { data: companyProfile } = await supabase
          .from('company_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (companyProfile) {
          const { data: jobs } = await supabase
            .from('jobs')
            .select('id, is_active')
            .eq('company_id', companyProfile.id);

          stats.totalJobs = jobs?.length || 0;
          stats.activeJobs = jobs?.filter(job => job.is_active).length || 0;
        }

        return { data: stats, error: null };
      };

      const { data, error } = await apiClient.request(operation, {
        cache: true,
        cacheKey: `user_stats_${userId}`
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const normalizedError = handleApiError(error, 'getUserStats');
      return { data: null, error: normalizedError };
    }
  },
};

export default userService;