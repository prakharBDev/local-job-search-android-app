import { supabase } from '../utils/supabase';

/**
 * Seeker Service
 * Handles job seeker profile operations, skills management, and categories
 */
const seekerService = {
  /**
   * Create a new seeker profile
   * @param {Object} profileData - Profile data including user_id
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createSeekerProfile(profileData) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Update seeker profile
   * @param {string} seekerId - Seeker profile ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateSeekerProfile(seekerId, updates) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', seekerId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Get seeker profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Get seeker profile with related skills and categories
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSeekerProfileWithRelations(userId) {
    try {
      const { data, error } = await supabase
        .from('seeker_profiles')
        .select(`
          *,
          seeker_skills(
            skill_id,
            skills(id, name)
          ),
          seeker_categories(
            category_id,
            job_categories(id, name)
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker profile with relations:', error);
      return { data: null, error };
    }
  },

  /**
   * Add skills to seeker profile
   * @param {string} seekerId - Seeker profile ID
   * @param {Array<string>} skillIds - Array of skill IDs
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async addSeekerSkills(seekerId, skillIds) {
    try {
      const skillsData = skillIds.map(skillId => ({
        seeker_id: seekerId,
        skill_id: skillId,
      }));

      const { data, error } = await supabase
        .from('seeker_skills')
        .insert(skillsData)
        .select();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error adding seeker skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove skills from seeker profile
   * @param {string} seekerId - Seeker profile ID
   * @param {Array<string>} skillIds - Array of skill IDs to remove
   * @returns {Promise<{error: Error|null}>}
   */
  async removeSeekerSkills(seekerId, skillIds) {
    try {
      const { error } = await supabase
        .from('seeker_skills')
        .delete()
        .eq('seeker_id', seekerId)
        .in('skill_id', skillIds);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error removing seeker skills:', error);
      return { error };
    }
  },

  /**
   * Add categories to seeker profile
   * @param {string} seekerId - Seeker profile ID
   * @param {Array<string>} categoryIds - Array of category IDs
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async addSeekerCategories(seekerId, categoryIds) {
    try {
      const categoriesData = categoryIds.map(categoryId => ({
        seeker_id: seekerId,
        category_id: categoryId,
      }));

      const { data, error } = await supabase
        .from('seeker_categories')
        .insert(categoriesData)
        .select();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error adding seeker categories:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove categories from seeker profile
   * @param {string} seekerId - Seeker profile ID
   * @param {Array<string>} categoryIds - Array of category IDs to remove
   * @returns {Promise<{error: Error|null}>}
   */
  async removeSeekerCategories(seekerId, categoryIds) {
    try {
      const { error } = await supabase
        .from('seeker_categories')
        .delete()
        .eq('seeker_id', seekerId)
        .in('category_id', categoryIds);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error removing seeker categories:', error);
      return { error };
    }
  },

  /**
   * Get seeker's skills
   * @param {string} seekerId - Seeker profile ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSeekerSkills(seekerId) {
    try {
      const { data, error } = await supabase
        .from('seeker_skills')
        .select(`
          skill_id,
          skills(id, name)
        `)
        .eq('seeker_id', seekerId);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Get seeker's categories
   * @param {string} seekerId - Seeker profile ID
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getSeekerCategories(seekerId) {
    try {
      const { data, error } = await supabase
        .from('seeker_categories')
        .select(`
          category_id,
          job_categories(id, name)
        `)
        .eq('seeker_id', seekerId);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching seeker categories:', error);
      return { data: null, error };
    }
  },
};

export default seekerService;