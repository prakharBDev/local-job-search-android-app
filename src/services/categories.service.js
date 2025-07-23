import { supabase } from '../utils/supabase';

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
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new category
   * @param {string} name - Category name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createCategory(name) {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating category:', error);
      return { data: null, error };
    }
  },

  /**
   * Get specific category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getCategoryById(categoryId) {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      return { data: null, error };
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
      const { data, error } = await supabase
        .from('job_categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating category:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove category (if no references)
   * @param {string} categoryId - Category ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteCategory(categoryId) {
    try {
      const { error } = await supabase
        .from('job_categories')
        .delete()
        .eq('id', categoryId);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { error };
    }
  },

  /**
   * Get categories with job counts
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getCategoriesWithJobCount() {
    try {
      const { data, error } = await supabase
        .from('job_categories')
        .select(`
          *,
          jobs(count)
        `)
        .order('name');

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
      console.error('Error fetching categories with job count:', error);
      return { data: null, error };
    }
  },
};

export default categoriesService;