import { apiClient, buildCompanyProfileQuery, handleApiError } from './api';

/**
 * Company Service
 * Handles company profile operations, verification status, and company-related data
 */
const companyService = {
  /**
   * Create a new company profile
   * @param {Object} profileData - Profile data (must include user_id)
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createCompanyProfile(profileData) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .insert([{
              ...profileData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'createCompanyProfile'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('company_profiles');
      apiClient.clearCache(`company_profile_${profileData.user_id}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'createCompanyProfile');
      return { data: null, error: apiError };
    }
  },

  /**
   * Update company profile
   * @param {string} companyId - Company profile ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateCompanyProfile(companyId, updates) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', companyId)
            .select()
            .single();
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'updateCompanyProfile'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('company_profiles');
      apiClient.clearCache(`company_profile_${data?.user_id}`);
      apiClient.clearCache(`company_${companyId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateCompanyProfile');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get company profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyProfile(userId) {
    try {
      const { data, error } = await buildCompanyProfileQuery(userId, {
        includeJobs: false,
        includeApplications: false,
        cache: true,
        cacheKey: `company_profile_${userId}`
      });

      if (error) {
        throw error;
      }

      // Handle array response - return first item or null if no profile exists
      const profile = Array.isArray(data) ? data[0] || null : data;
      
      return { data: profile, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompanyProfile');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get company profile by company ID
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyById(companyId) {
    try {
      const { data, error } = await apiClient.query('company_profiles', {
        select: `
          *,
          users(name, email)
        `,
        filters: { id: companyId },
        cache: true,
        cacheKey: `company_${companyId}`
      });

      if (error) {
        throw error;
      }

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompanyById');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get all verified companies
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getVerifiedCompanies() {
    try {
      const { data, error } = await apiClient.query('company_profiles', {
        select: `
          *,
          users(name, email)
        `,
        filters: { is_verified: true },
        orderBy: { column: 'company_name', ascending: true },
        cache: true,
        cacheKey: 'verified_companies'
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getVerifiedCompanies');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get companies by city
   * @param {string} city - City name ('morena' or 'gwalior')
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCompaniesByCity(city) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .select(`
              *,
              users(city)
            `)
            .eq('users.city', city)
            .order('company_name');
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: `companies_city_${city}`,
          context: 'getCompaniesByCity'
        }
      );

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompaniesByCity');
      return { data: null, error: apiError };
    }
  },

  /**
   * Update company verification status (admin only)
   * @param {string} companyId - Company profile ID
   * @param {boolean} isVerified - Verification status
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateVerificationStatus(companyId, isVerified) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .update({ 
              is_verified: isVerified,
              updated_at: new Date().toISOString(),
            })
            .eq('id', companyId)
            .select()
            .single();
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'updateVerificationStatus'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('company_profiles');
      apiClient.clearCache('verified_companies');
      apiClient.clearCache(`company_${companyId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateVerificationStatus');
      return { data: null, error: apiError };
    }
  },

  /**
   * Search companies by name
   * @param {string} searchTerm - Search term for company name
   * @param {number} limit - Maximum number of results (default: 20)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchCompanies(searchTerm, limit = 20) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .select(`
              *,
              users(name, email, city)
            `)
            .ilike('company_name', `%${searchTerm}%`)
            .order('company_name')
            .limit(limit);
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: `search_companies_${searchTerm}_${limit}`,
          context: 'searchCompanies'
        }
      );

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'searchCompanies');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get company profile with job statistics
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyWithStats(companyId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .select(`
              *,
              users(name, email, city),
              jobs(
                id,
                title,
                is_active,
                created_at,
                applications(id, status)
              )
            `)
            .eq('id', companyId)
            .single();
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: `company_stats_${companyId}`,
          context: 'getCompanyWithStats'
        }
      );

      if (error) {
        throw error;
      }

      // Calculate statistics
      if (data && data.jobs) {
        const jobs = data.jobs;
        const stats = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.is_active).length,
          totalApplications: jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0),
          recentJobs: jobs.filter(job => {
            const jobDate = new Date(job.created_at);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return jobDate >= thirtyDaysAgo;
          }).length,
        };
        data.statistics = stats;
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompanyWithStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Delete company profile (soft delete by deactivating)
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async deleteCompanyProfile(companyId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('company_profiles')
            .delete()
            .eq('id', companyId)
            .select()
            .single();
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'deleteCompanyProfile'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('company_profiles');
      apiClient.clearCache('verified_companies');
      apiClient.clearCache(`company_${companyId}`);
      if (data?.user_id) {
        apiClient.clearCache(`company_profile_${data.user_id}`);
      }

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'deleteCompanyProfile');
      return { data: null, error: apiError };
    }
  },
};

export default companyService;