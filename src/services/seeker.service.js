import { supabase } from '../utils/supabase';

/**
 * Seeker Service
 * Handles job seeker profile operations, skills management, and categories
 */
const seekerService = {
  /**
   * Create a new seeker profile
   * @param {Object} profileData - Profile data (must include user_id)
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createSeekerProfile(profileData) {
    try {
      // Expect user_id to be provided by the caller (from AuthContext)
      const { data, error } = await supabase
        .from('seeker_profiles')
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
      // First, get existing skills to avoid duplicates
      const { data: existingSkills } = await supabase
        .from('seeker_skills')
        .select('skill_id')
        .eq('seeker_id', seekerId);

      const existingSkillIds = existingSkills?.map(s => s.skill_id) || [];
      const newSkillIds = skillIds.filter(skillId => !existingSkillIds.includes(skillId));

      if (newSkillIds.length === 0) {
        console.log('All skills already exist for this seeker');
        return { data: existingSkills, error: null };
      }

      const skillsData = newSkillIds.map(skillId => ({
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
   * Add categories to seeker profile (handles existing relationships)
   * @param {string} seekerId - Seeker profile ID
   * @param {Array<string>} categoryIds - Array of category IDs
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async addSeekerCategories(seekerId, categoryIds) {
    try {
      // First, get existing categories to avoid duplicates
      const { data: existingCategories } = await supabase
        .from('seeker_categories')
        .select('category_id')
        .eq('seeker_id', seekerId);

      const existingCategoryIds = existingCategories?.map(c => c.category_id) || [];
      const newCategoryIds = categoryIds.filter(categoryId => !existingCategoryIds.includes(categoryId));

      if (newCategoryIds.length === 0) {
        console.log('All categories already exist for this seeker');
        return { data: existingCategories, error: null };
      }

      const categoriesData = newCategoryIds.map(categoryId => ({
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