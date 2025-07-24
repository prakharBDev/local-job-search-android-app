import { apiClient, handleApiError } from './api';

/**
 * Categories Service
 * Manages job categories (CRUD operations)
 */
const categoriesService = {
  /**
   * Get all job categories
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getAllCategories() {
    try {
      const { data, error } = await apiClient.query('job_categories', {
        select: '*',
        orderBy: { column: 'name', ascending: true },
        cache: true,
        cacheKey: 'all_categories',
      });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getAllCategories');
      return { data: null, error: apiError };
    }
  },

  /**
   * Create a new category
   * @param {string} name - Category name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createCategory(name) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('job_categories')
            .insert([
              {
                name: name.trim(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'createCategory',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_categories');
      apiClient.clearCache('categories_with_job_count');

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'createCategory');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get specific category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCategoryById(categoryId) {
    try {
      const { data, error } = await apiClient.query('job_categories', {
        select: '*',
        filters: { id: categoryId },
        limit: 1,
        cache: true,
        cacheKey: `category_${categoryId}`,
      });

      if (error) {
        throw error;
      }
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCategoryById');
      return { data: null, error: apiError };
    }
  },

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateCategory(categoryId, updates) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('job_categories')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', categoryId)
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'updateCategory',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_categories');
      apiClient.clearCache('categories_with_job_count');
      apiClient.clearCache(`category_${categoryId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateCategory');
      return { data: null, error: apiError };
    }
  },

  /**
   * Remove category (if no references)
   * @param {string} categoryId - Category ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteCategory(categoryId) {
    try {
      const { error } = await apiClient.request(
        async () => {
          const { error } = await apiClient.supabase
            .from('job_categories')
            .delete()
            .eq('id', categoryId);

          return { error };
        },
        {
          cache: false,
          retries: false,
          context: 'deleteCategory',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_categories');
      apiClient.clearCache('categories_with_job_count');
      apiClient.clearCache(`category_${categoryId}`);

      return { error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'deleteCategory');
      return { error: apiError };
    }
  },

  /**
   * Get categories with job counts
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCategoriesWithJobCount() {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('job_categories')
            .select(
              `
              *,
              jobs(count)
            `,
            )
            .order('name');

          return { data, error };
        },
        {
          cache: true,
          cacheKey: 'categories_with_job_count',
          context: 'getCategoriesWithJobCount',
        },
      );

      if (error) {
        throw error;
      }

      // Transform the data to include job count
      const categoriesWithCount = data.map(category => ({
        ...category,
        job_count: category.jobs?.[0]?.count || 0,
      }));

      return { data: categoriesWithCount, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getCategoriesWithJobCount');
      return { data: null, error: apiError };
    }
  },
};

export default categoriesService;
