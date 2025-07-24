import { apiClient } from './client';

/**
 * Query Builders for Complex Database Relationships
 * Provides standardized patterns for common query operations
 */

/**
 * Build job query with related data
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildJobQuery = (options = {}) => {
  const {
    filters = {},
    includeCompany = true,
    includeCategory = true,
    includeSkills = true,
    includeApplications = false,
    limit = null,
    offset = null,
    orderBy = { column: 'created_at', ascending: false },
    cache = true,
  } = options;

  // Build select statement
  const select = `
    *,
    ${
      includeCompany
        ? 'company_profiles(id, company_name, company_description, is_verified)'
        : ''
    }
    ${includeCategory ? ',job_categories(id, name)' : ''}
    ${includeSkills ? ',job_skills(skill_id, skills(id, name))' : ''}
    ${includeApplications ? ',applications(id, status, created_at)' : ''}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return apiClient.query('jobs', {
    select,
    filters: {
      is_active: true,
      ...filters,
    },
    orderBy,
    limit,
    offset,
    cache,
    cacheKey: `jobs_${JSON.stringify(options)}`,
  });
};

/**
 * Build profile query with related data
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildProfileQuery = (userId, options = {}) => {
  const {
    includeSeeker = true,
    includeCompany = true,
    includeSkills = true,
    includeCategories = true,
    cache = true,
  } = options;

  // Build select statement for user with profiles
  const select = `
    *,
    ${includeSeeker ? 'seeker_profiles(*)' : ''}
    ${includeCompany ? ',company_profiles(*)' : ''}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return apiClient.query('users', {
    select,
    filters: { id: userId },
    cache,
    cacheKey: `user_profile_${userId}`,
  });
};

/**
 * Build seeker profile query with skills and categories
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildSeekerProfileQuery = (userId, options = {}) => {
  const {
    includeSkills = true,
    includeCategories = true,
    includeApplications = false,
    cache = true,
  } = options;

  // Build select statement
  const select = `
    *,
    users(id, name, email, phone_number, city),
    ${includeSkills ? 'seeker_skills(skill_id, skills(id, name))' : ''}
    ${
      includeCategories
        ? ',seeker_categories(category_id, job_categories(id, name))'
        : ''
    }
    ${
      includeApplications
        ? ',applications(id, status, created_at, jobs(id, title, company_profiles(company_name)))'
        : ''
    }
  `
    .replace(/\s+/g, ' ')
    .trim();

  return apiClient.query('seeker_profiles', {
    select,
    filters: { user_id: userId },
    cache,
    cacheKey: `seeker_profile_${userId}`,
    single: false, // Changed from true to false to handle case when no profile exists
  });
};

/**
 * Build company profile query with jobs
 * @param {string} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildCompanyProfileQuery = (userId, options = {}) => {
  const {
    includeJobs = true,
    includeApplications = false,
    cache = true,
  } = options;

  // Build select statement
  let select = '*';
  
  if (includeJobs) {
    select += ',jobs(id,title,description,city,is_active,created_at)';
  }
  
  if (includeApplications) {
    select += ',jobs(applications(id,status,created_at,seeker_profiles(users(name))))';
  }

  return apiClient.query('company_profiles', {
    select,
    filters: { user_id: userId },
    cache,
    cacheKey: `company_profile_${userId}`,
  });
};

/**
 * Build application query with related data
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildApplicationQuery = (options = {}) => {
  const {
    filters = {},
    includeJob = true,
    includeSeeker = true,
    includeCompany = true,
    limit = null,
    offset = null,
    orderBy = { column: 'created_at', ascending: false },
    cache = true,
  } = options;

  // Build select statement
  let select = '*';
  
  if (includeJob) {
    select += ',jobs(id,title,description,city,salary,job_categories(id,name),company_profiles(id,company_name,is_verified))';
  }
  
  if (includeSeeker) {
    select += ',seeker_profiles(experience_level,users(name,email))';
  }

  return apiClient.query('applications', {
    select,
    filters,
    orderBy,
    limit,
    offset,
    cache,
    cacheKey: `applications_${JSON.stringify(options)}`,
  });
};

/**
 * Build search query with multiple tables
 * @param {string} searchTerm - Search term
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildSearchQuery = (searchTerm, options = {}) => {
  const {
    searchIn = ['jobs', 'skills', 'categories'],
    filters = {},
    limit = 20,
    cache = false, // Don't cache search results
  } = options;

  const operation = async supabase => {
    const results = {};

    // Search in jobs
    if (searchIn.includes('jobs')) {
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(
          `
          *,
          company_profiles(id, company_name, is_verified),
          job_categories(id, name)
        `,
        )
        .eq('is_active', true)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(limit);

      if (!jobsError) {
        results.jobs = jobs;
      }
    }

    // Search in skills
    if (searchIn.includes('skills')) {
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(limit);

      if (!skillsError) {
        results.skills = skills;
      }
    }

    // Search in categories
    if (searchIn.includes('categories')) {
      const { data: categories, error: categoriesError } = await supabase
        .from('job_categories')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .limit(limit);

      if (!categoriesError) {
        results.categories = categories;
      }
    }

    return { data: results, error: null };
  };

  return apiClient.request(operation, { cache });
};

/**
 * Build dashboard stats query
 * @param {string} userId - User ID
 * @param {string} userType - 'seeker' or 'company'
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildDashboardStatsQuery = (userId, userType, options = {}) => {
  const { cache = true } = options;

  const operation = async supabase => {
    const stats = {};

    if (userType === 'seeker') {
      // Get seeker stats
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('status')
        .eq('seeker_id', userId);

      if (!appsError) {
        stats.totalApplications = applications.length;
        stats.applicationsByStatus = applications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {});
      }

      // Get recent jobs
      const { data: recentJobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, company_profiles(company_name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!jobsError) {
        stats.recentJobs = recentJobs;
      }
    } else if (userType === 'company') {
      // Get company stats
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(
          `
          id,
          applications(id, status)
        `,
        )
        .eq('company_id', userId);

      if (!jobsError) {
        stats.totalJobs = jobs.length;
        stats.totalApplications = jobs.reduce(
          (sum, job) => sum + job.applications.length,
          0,
        );
        stats.applicationsByStatus = jobs.reduce((acc, job) => {
          job.applications.forEach(app => {
            acc[app.status] = (acc[app.status] || 0) + 1;
          });
          return acc;
        }, {});
      }
    }

    return { data: stats, error: null };
  };

  return apiClient.request(operation, {
    cache,
    cacheKey: `dashboard_stats_${userType}_${userId}`,
  });
};

/**
 * Build many-to-many relationship query
 * @param {string} table - Main table name
 * @param {string} junctionTable - Junction table name
 * @param {string} relatedTable - Related table name
 * @param {Object} options - Query options
 * @returns {Promise<{data: any, error: Error|null}>}
 */
export const buildManyToManyQuery = (
  table,
  junctionTable,
  relatedTable,
  options = {},
) => {
  const {
    filters = {},
    includeRelated = true,
    limit = null,
    offset = null,
    cache = true,
  } = options;

  // Build select statement
  const select = includeRelated
    ? `*, ${junctionTable}(${relatedTable}(*))`
    : `*, ${junctionTable}(*)`;

  return apiClient.query(table, {
    select,
    filters,
    limit,
    offset,
    cache,
    cacheKey: `${table}_${junctionTable}_${relatedTable}_${JSON.stringify(
      options,
    )}`,
  });
};
