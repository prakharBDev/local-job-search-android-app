import { supabase } from '../utils/supabase';

/**
 * Analytics Service
 * Handles analytics, reporting, and dashboard statistics
 */
const analyticsService = {
  /**
   * Get dashboard overview statistics
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getDashboardStats(city = null) {
    try {
      // Get user counts
      let userQuery = supabase
        .from('users')
        .select('id, user_type, created_at');
      
      if (city) {
        userQuery = userQuery.eq('city', city);
      }

      const { data: users, error: userError } = await userQuery;
      if (userError) throw userError;

      // Get job counts
      let jobQuery = supabase
        .from('jobs')
        .select('id, is_active, created_at, city');
      
      if (city) {
        jobQuery = jobQuery.eq('city', city);
      }

      const { data: jobs, error: jobError } = await jobQuery;
      if (jobError) throw jobError;

      // Get application counts
      let applicationQuery = supabase
        .from('applications')
        .select('id, status, created_at');

      if (city) {
        applicationQuery = applicationQuery
          .select(`
            id, status, created_at,
            jobs!inner(city)
          `)
          .eq('jobs.city', city);
      }

      const { data: applications, error: appError } = await applicationQuery;
      if (appError) throw appError;

      // Calculate statistics
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const stats = {
        users: {
          total: users.length,
          seekers: users.filter(u => u.user_type === 'seeker').length,
          companies: users.filter(u => u.user_type === 'company').length,
          newThisMonth: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
        },
        jobs: {
          total: jobs.length,
          active: jobs.filter(j => j.is_active).length,
          inactive: jobs.filter(j => !j.is_active).length,
          newThisMonth: jobs.filter(j => new Date(j.created_at) >= thirtyDaysAgo).length,
        },
        applications: {
          total: applications.length,
          applied: applications.filter(a => a.status === 'applied').length,
          underReview: applications.filter(a => a.status === 'under_review').length,
          hired: applications.filter(a => a.status === 'hired').length,
          rejected: applications.filter(a => a.status === 'rejected').length,
          newThisMonth: applications.filter(a => new Date(a.created_at) >= thirtyDaysAgo).length,
          successRate: applications.length > 0 ? 
            ((applications.filter(a => a.status === 'hired').length / applications.length) * 100).toFixed(1) : 0,
        },
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { data: null, error };
    }
  },

  /**
   * Get job posting trends over time
   * @param {number} days - Number of days to analyze (default: 30)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getJobPostingTrends(days = 30, city = null) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('jobs')
        .select('created_at, city')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      if (city) {
        query = query.eq('city', city);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Group by date
      const trends = data.reduce((acc, job) => {
        const date = new Date(job.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format
      const trendArray = Object.entries(trends).map(([date, count]) => ({
        date,
        count,
      }));

      return { data: trendArray, error: null };
    } catch (error) {
      console.error('Error fetching job posting trends:', error);
      return { data: null, error };
    }
  },

  /**
   * Get application trends over time
   * @param {number} days - Number of days to analyze (default: 30)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getApplicationTrends(days = 30, city = null) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let query = supabase
        .from('applications')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString())
        .order('created_at');

      if (city) {
        query = query
          .select(`
            created_at, status,
            jobs!inner(city)
          `)
          .eq('jobs.city', city);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Group by date and status
      const trends = data.reduce((acc, application) => {
        const date = new Date(application.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, applied: 0, hired: 0, rejected: 0, total: 0 };
        }
        acc[date][application.status] = (acc[date][application.status] || 0) + 1;
        acc[date].total++;
        return acc;
      }, {});

      const trendArray = Object.values(trends);

      return { data: trendArray, error: null };
    } catch (error) {
      console.error('Error fetching application trends:', error);
      return { data: null, error };
    }
  },

  /**
   * Get top performing companies by applications
   * @param {number} limit - Number of companies to return (default: 10)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getTopCompanies(limit = 10, city = null) {
    try {
      let query = supabase
        .from('company_profiles')
        .select(`
          id,
          company_name,
          is_verified,
          jobs(
            id,
            title,
            city,
            created_at,
            applications(id, status)
          )
        `);

      if (city) {
        query = query.eq('jobs.city', city);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate company statistics
      const companyStats = data.map(company => {
        const jobs = company.jobs || [];
        const totalApplications = jobs.reduce((sum, job) => 
          sum + (job.applications?.length || 0), 0);
        const hiredCount = jobs.reduce((sum, job) => 
          sum + (job.applications?.filter(app => app.status === 'hired').length || 0), 0);

        return {
          id: company.id,
          name: company.company_name,
          isVerified: company.is_verified,
          totalJobs: jobs.length,
          totalApplications,
          hiredCount,
          successRate: totalApplications > 0 ? 
            ((hiredCount / totalApplications) * 100).toFixed(1) : 0,
        };
      });

      // Sort by total applications and limit
      const topCompanies = companyStats
        .filter(company => company.totalApplications > 0)
        .sort((a, b) => b.totalApplications - a.totalApplications)
        .slice(0, limit);

      return { data: topCompanies, error: null };
    } catch (error) {
      console.error('Error fetching top companies:', error);
      return { data: null, error };
    }
  },

  /**
   * Get most popular job categories
   * @param {number} limit - Number of categories to return (default: 10)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getPopularCategories(limit = 10, city = null) {
    try {
      let query = supabase
        .from('job_categories')
        .select(`
          id,
          name,
          jobs(
            id,
            city,
            is_active,
            applications(id)
          )
        `);

      const { data, error } = await query;
      if (error) throw error;

      // Calculate category statistics
      const categoryStats = data.map(category => {
        let jobs = category.jobs || [];
        
        // Filter by city if specified
        if (city) {
          jobs = jobs.filter(job => job.city === city);
        }

        const activeJobs = jobs.filter(job => job.is_active);
        const totalApplications = jobs.reduce((sum, job) => 
          sum + (job.applications?.length || 0), 0);

        return {
          id: category.id,
          name: category.name,
          totalJobs: jobs.length,
          activeJobs: activeJobs.length,
          totalApplications,
          averageApplicationsPerJob: jobs.length > 0 ? 
            (totalApplications / jobs.length).toFixed(1) : 0,
        };
      });

      // Sort by total jobs and limit
      const popularCategories = categoryStats
        .filter(category => category.totalJobs > 0)
        .sort((a, b) => b.totalJobs - a.totalJobs)
        .slice(0, limit);

      return { data: popularCategories, error: null };
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      return { data: null, error };
    }
  },

  /**
   * Get user activity statistics
   * @param {string} period - Period to analyze ('week', 'month', 'quarter')
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getUserActivity(period = 'month', city = null) {
    try {
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get user registrations
      let userQuery = supabase
        .from('users')
        .select('created_at, user_type, last_login_at, city')
        .gte('created_at', startDate.toISOString());

      if (city) {
        userQuery = userQuery.eq('city', city);
      }

      const { data: users, error: userError } = await userQuery;
      if (userError) throw userError;

      // Get login activity (based on last_login_at)
      let loginQuery = supabase
        .from('users')
        .select('last_login_at, user_type, city')
        .gte('last_login_at', startDate.toISOString());

      if (city) {
        loginQuery = loginQuery.eq('city', city);
      }

      const { data: logins, error: loginError } = await loginQuery;
      if (loginError) throw loginError;

      const activity = {
        newUsers: {
          total: users.length,
          seekers: users.filter(u => u.user_type === 'seeker').length,
          companies: users.filter(u => u.user_type === 'company').length,
        },
        activeUsers: {
          total: logins.length,
          seekers: logins.filter(u => u.user_type === 'seeker').length,
          companies: logins.filter(u => u.user_type === 'company').length,
        },
        engagement: {
          loginRate: users.length > 0 ? 
            ((logins.length / users.length) * 100).toFixed(1) : 0,
        },
      };

      return { data: activity, error: null };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return { data: null, error };
    }
  },

  /**
   * Get skill demand analysis
   * @param {number} limit - Number of skills to return (default: 20)
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSkillDemand(limit = 20, city = null) {
    try {
      let query = supabase
        .from('skills')
        .select(`
          id,
          name,
          job_skills(
            job_id,
            jobs(
              id,
              city,
              is_active,
              created_at
            )
          ),
          seeker_skills(
            seeker_id
          )
        `);

      const { data, error } = await query;
      if (error) throw error;

      // Calculate skill demand statistics
      const skillStats = data.map(skill => {
        let jobSkills = skill.job_skills || [];
        
        // Filter by city if specified
        if (city) {
          jobSkills = jobSkills.filter(js => js.jobs?.city === city);
        }

        const activeJobsCount = jobSkills.filter(js => js.jobs?.is_active).length;
        const seekersCount = skill.seeker_skills?.length || 0;

        return {
          id: skill.id,
          name: skill.name,
          demandInJobs: jobSkills.length,
          activeJobDemand: activeJobsCount,
          seekersWithSkill: seekersCount,
          demandSupplyRatio: seekersCount > 0 ? 
            (activeJobsCount / seekersCount).toFixed(2) : 'Infinite',
          competitiveness: seekersCount > 0 ? 
            (seekersCount / Math.max(activeJobsCount, 1)).toFixed(2) : 0,
        };
      });

      // Sort by active job demand and limit
      const topSkills = skillStats
        .filter(skill => skill.activeJobDemand > 0)
        .sort((a, b) => b.activeJobDemand - a.activeJobDemand)
        .slice(0, limit);

      return { data: topSkills, error: null };
    } catch (error) {
      console.error('Error fetching skill demand:', error);
      return { data: null, error };
    }
  },

  /**
   * Get city-wise statistics comparison
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCityComparison() {
    try {
      const cities = ['morena', 'gwalior'];
      const comparison = {};

      for (const city of cities) {
        const cityStats = await this.getDashboardStats(city);
        if (cityStats.error) {
          throw cityStats.error;
        }
        comparison[city] = cityStats.data;
      }

      return { data: comparison, error: null };
    } catch (error) {
      console.error('Error fetching city comparison:', error);
      return { data: null, error };
    }
  },

  /**
   * Get conversion funnel statistics
   * @param {string} city - Filter by city (optional)
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getConversionFunnel(city = null) {
    try {
      // Get user registration data
      let userQuery = supabase
        .from('users')
        .select('id, user_type, city, created_at');

      if (city) {
        userQuery = userQuery.eq('city', city);
      }

      const { data: users, error: userError } = await userQuery;
      if (userError) throw userError;

      const seekers = users.filter(u => u.user_type === 'seeker');
      
      // Get seekers with profiles
      const { data: seekerProfiles, error: profileError } = await supabase
        .from('seeker_profiles')
        .select('user_id');

      if (profileError) throw profileError;

      // Get seekers with applications
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('seeker_id')
        .in('seeker_id', seekerProfiles.map(sp => sp.user_id));

      if (appError) throw appError;

      const uniqueApplicants = [...new Set(applications.map(a => a.seeker_id))];

      const funnel = {
        userRegistrations: users.length,
        seekerRegistrations: seekers.length,
        profileCompletions: seekerProfiles.length,
        jobApplications: uniqueApplicants.length,
        conversionRates: {
          registrationToProfile: seekers.length > 0 ? 
            ((seekerProfiles.length / seekers.length) * 100).toFixed(1) : 0,
          profileToApplication: seekerProfiles.length > 0 ? 
            ((uniqueApplicants.length / seekerProfiles.length) * 100).toFixed(1) : 0,
          overallConversion: seekers.length > 0 ? 
            ((uniqueApplicants.length / seekers.length) * 100).toFixed(1) : 0,
        },
      };

      return { data: funnel, error: null };
    } catch (error) {
      console.error('Error fetching conversion funnel:', error);
      return { data: null, error };
    }
  },
};

export default analyticsService;