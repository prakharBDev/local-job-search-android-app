import { apiClient, handleApiError } from './api';

/**
 * Analytics Service
 * Dashboard statistics and analytics for both seekers and companies
 */
const analyticsService = {
  /**
   * Get seeker dashboard statistics
   * @param {string} seekerId - Seeker profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerDashboardStats(seekerId) {
    try {
      const { data: applications, error: appError } = await apiClient.query('applications', {
        select: 'status',
        filters: { seeker_id: seekerId },
        cache: true,
        cacheKey: `seeker_stats_${seekerId}`
      });

      if (appError) {
        throw appError;
      }

      const stats = {
        totalApplications: applications.length,
        applied: applications.filter(app => app.status === 'applied').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        withdrawn: applications.filter(app => app.status === 'withdrawn').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getSeekerDashboardStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get company dashboard statistics
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyDashboardStats(companyId) {
    try {
      const { data: jobs, error: jobsError } = await apiClient.query('jobs', {
        select: 'id, is_active',
        filters: { company_id: companyId },
        cache: true,
        cacheKey: `company_jobs_${companyId}`
      });

      if (jobsError) {
        throw jobsError;
      }

      const { data: applications, error: appError } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .select('status, jobs!inner(company_id)')
            .eq('jobs.company_id', companyId);
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: `company_applications_${companyId}`,
          context: 'getCompanyDashboardStats'
        }
      );

      if (appError) {
        throw appError;
      }

      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.is_active).length,
        inactiveJobs: jobs.filter(job => !job.is_active).length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'applied').length,
        reviewed: applications.filter(app => app.status === 'reviewed').length,
        shortlisted: applications.filter(app => app.status === 'shortlisted').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCompanyDashboardStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get market statistics for a city
   * @param {string} city - City name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobMarketStats(city) {
    try {
      const { data: jobs, error: jobsError } = await apiClient.query('jobs', {
        select: 'id, is_active, salary_min, salary_max',
        filters: { 
          city: city,
          is_active: true 
        },
        cache: true,
        cacheKey: `market_jobs_${city}`
      });

      if (jobsError) {
        throw jobsError;
      }

      const { data: applications, error: appError } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('applications')
            .select('status, jobs!inner(city)')
            .eq('jobs.city', city);
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: `market_applications_${city}`,
          context: 'getJobMarketStats'
        }
      );

      if (appError) {
        throw appError;
      }

      const avgSalary = jobs.length > 0 
        ? jobs.reduce((sum, job) => sum + ((job.salary_min + job.salary_max) / 2), 0) / jobs.length
        : 0;

      const stats = {
        totalActiveJobs: jobs.length,
        totalApplications: applications.length,
        averageSalary: Math.round(avgSalary),
        applicationsPerJob: jobs.length > 0 ? applications.length / jobs.length : 0,
        city: city,
      };

      return { data: stats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getJobMarketStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get most in-demand skills
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSkillDemandStats() {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('job_skills')
            .select(`
              skill_id,
              skills(id, name),
              jobs!inner(is_active)
            `)
            .eq('jobs.is_active', true);
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: 'skill_demand_stats',
          context: 'getSkillDemandStats'
        }
      );

      if (error) {
        throw error;
      }

      const skillCounts = {};
      data.forEach(item => {
        const skillName = item.skills?.name;
        if (skillName) {
          skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
        }
      });

      const skillStats = Object.entries(skillCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return { data: skillStats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getSkillDemandStats');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get job distribution by category
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCategoryStats() {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('job_categories')
            .select(`
              id,
              name,
              jobs(count)
            `)
            .order('name');
          
          return { data, error };
        },
        { 
          cache: true,
          cacheKey: 'category_stats',
          context: 'getCategoryStats'
        }
      );

      if (error) {
        throw error;
      }

      const categoryStats = data.map(category => ({
        id: category.id,
        name: category.name,
        job_count: category.jobs?.[0]?.count || 0,
      }));

      return { data: categoryStats, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCategoryStats');
      return { data: null, error: apiError };
    }
  },
};

export default analyticsService;