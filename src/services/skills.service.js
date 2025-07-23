import { supabase } from '../utils/supabase';

/**
 * Skills Service
 * Handles all skills-related operations (CRUD, search, management)
 */
const skillsService = {
  /**
   * Get all available skills
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async getAllSkills() {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Create a new skill
   * @param {string} name - Skill name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createSkill(name) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([{ name: name.trim() }])
        .select();

      if (error) {
        throw error;
      }
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error creating skill:', error);
      return { data: null, error };
    }
  },

  /**
   * Search skills by name
   * @param {string} searchTerm - Search term for skill name
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchSkills(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')
        .limit(20);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error searching skills:', error);
      return { data: null, error };
    }
  },

  /**
   * Get specific skill by ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSkillById(skillId) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('id', skillId)
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching skill by ID:', error);
      return { data: null, error };
    }
  },

  /**
   * Update skill name
   * @param {string} skillId - Skill ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateSkill(skillId, updates) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', skillId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating skill:', error);
      return { data: null, error };
    }
  },

  /**
   * Remove skill (if no references)
   * @param {string} skillId - Skill ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteSkill(skillId) {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error deleting skill:', error);
      return { error };
    }
  },
};

export default skillsService;
