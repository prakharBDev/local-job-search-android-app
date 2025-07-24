import { apiClient, handleApiError } from './api';

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
      const { data, error } = await apiClient.query('skills', {
        select: '*',
        orderBy: { column: 'name', ascending: true },
        cache: true,
        cacheKey: 'all_skills',
      });

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getAllSkills');
      return { data: null, error: apiError };
    }
  },

  /**
   * Create a new skill
   * @param {string} name - Skill name
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createSkill(name) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('skills')
            .insert([
              {
                name: name.trim(),
                created_at: new Date().toISOString(),
              },
            ])
            .select();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'createSkill',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_skills');
      apiClient.clearCache('skills');

      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'createSkill');
      return { data: null, error: apiError };
    }
  },

  /**
   * Search skills by name
   * @param {string} searchTerm - Search term for skill name
   * @returns {Promise<{data: Array|null, error: Error|null}>}
   */
  async searchSkills(searchTerm) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('skills')
            .select('*')
            .ilike('name', `%${searchTerm}%`)
            .order('name')
            .limit(20);

          return { data, error };
        },
        {
          cache: true,
          cacheKey: `search_skills_${searchTerm}`,
          context: 'searchSkills',
        },
      );

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'searchSkills');
      return { data: null, error: apiError };
    }
  },

  /**
   * Get specific skill by ID
   * @param {string} skillId - Skill ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async getSkillById(skillId) {
    try {
      const { data, error } = await apiClient.query('skills', {
        select: '*',
        filters: { id: skillId },
        limit: 1,
        cache: true,
        cacheKey: `skill_${skillId}`,
      });

      if (error) {
        throw error;
      }
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'getSkillById');
      return { data: null, error: apiError };
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
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('skills')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', skillId)
            .select()
            .single();

          return { data, error };
        },
        {
          cache: false,
          retries: false,
          context: 'updateSkill',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_skills');
      apiClient.clearCache('skills');
      apiClient.clearCache(`skill_${skillId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateSkill');
      return { data: null, error: apiError };
    }
  },

  /**
   * Remove skill (if no references)
   * @param {string} skillId - Skill ID
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteSkill(skillId) {
    try {
      const { error } = await apiClient.request(
        async () => {
          const { error } = await apiClient.supabase
            .from('skills')
            .delete()
            .eq('id', skillId);

          return { error };
        },
        {
          cache: false,
          retries: false,
          context: 'deleteSkill',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache('all_skills');
      apiClient.clearCache('skills');
      apiClient.clearCache(`skill_${skillId}`);

      return { error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'deleteSkill');
      return { error: apiError };
    }
  },
};

export default skillsService;
