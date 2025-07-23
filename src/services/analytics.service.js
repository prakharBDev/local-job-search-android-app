import { supabase } from '../utils/supabase';

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
        underReview: applications.filter(app => app.status === 'under_review').length,
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
   * Get company dashboard statistics
   * @param {string} companyId - Company profile ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCompanyDashboardStats(companyId) {
    try {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, is_active')
        .eq('company_id', companyId);

      if (jobsError) {
        throw jobsError;
      }

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
        pendingApplications: applications.filter(app => app.status === 'applied').length,
        underReview: applications.filter(app => app.status === 'under_review').length,
        hired: applications.filter(app => app.status === 'hired').length,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching company dashboard stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get market statistics for a city
   * @param {string} city - City name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getJobMarketStats(city) {
    try {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, is_active, salary_min, salary_max')
        .eq('city', city)
        .eq('is_active', true);

      if (jobsError) {
        throw jobsError;
      }

      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('status, jobs!inner(city)')
        .eq('jobs.city', city);

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
      console.error('Error fetching job market stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get most in-demand skills
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSkillDemandStats() {
    try {
      const { data, error } = await supabase
        .from('job_skills')
        .select(`
          skill_id,
          skills(id, name),
          jobs!inner(is_active)
        `)
        .eq('jobs.is_active', true);

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
      console.error('Error fetching skill demand stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get job distribution by category
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCategoryStats() {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select(`
          id,
          name,
          jobs(count)
        `)
        .order('name');

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
      console.error('Error fetching category stats:', error);
      return { data: null, error };
    }
  },
};

export default analyticsService;