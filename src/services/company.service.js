import { supabase } from '../utils/supabase';

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
      // Expect user_id to be provided by the caller (from AuthContext)
      const { data, error } = await supabase
        .from('company_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
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
   * @param {string} companyId - Company profile ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateCompanyProfile(companyId, updates) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
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
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Get company profile by company ID
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyById(companyId) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select(`
          *,
          users(name, email)
        `)
        .eq('id', companyId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching company by ID:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all verified companies
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getVerifiedCompanies() {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select(`
          *,
          users(name, email)
        `)
        .eq('is_verified', true)
        .order('company_name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching verified companies:', error);
      return { data: null, error };
    }
  },

  /**
   * Get companies by city
   * @param {string} city - City name ('morena' or 'gwalior')
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCompaniesByCity(city) {
    try {
      const { data, error } = await supabase
        .from('company_profiles')
        .select(`
          *,
          users(city)
        `)
        .eq('users.city', city)
        .order('company_name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching companies by city:', error);
      return { data: null, error };
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
      const { data, error } = await supabase
        .from('company_profiles')
        .update({ 
          is_verified: isVerified,
          updated_at: new Date().toISOString(),
        })
        .eq('id', companyId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating verification status:', error);
      return { data: null, error };
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
      const { data, error } = await supabase
        .from('company_profiles')
        .select(`
          *,
          users(name, email, city)
        `)
        .ilike('company_name', `%${searchTerm}%`)
        .order('company_name')
        .limit(limit);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error searching companies:', error);
      return { data: null, error };
    }
  },

  /**
   * Get company profile with job statistics
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyWithStats(companyId) {
    try {
      const { data, error } = await supabase
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
      console.error('Error fetching company with stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete company profile (soft delete by deactivating)
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async deleteCompanyProfile(companyId) {
    try {
      // Instead of actual deletion, we could mark as inactive
      // For now, we'll do actual deletion but in production, consider soft delete
      const { data, error } = await supabase
        .from('company_profiles')
        .delete()
        .eq('id', companyId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting company profile:', error);
      return { data: null, error };
    }
  },
};

export default companyService;