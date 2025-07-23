import { supabase } from '../utils/supabase';

/**
 * User Service
 * Handles user profile operations, authentication updates, and basic user management
 */
const userService = {
  /**
   * Get user profile with seeker and company profiles
   */
  async getUserProfile(userId) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(
          `
          *,
          seeker_profiles(*),
          company_profiles(*)
        `,
        )
        .eq('id', userId)
        .single();

      if (userError) {
        throw userError;
      }
      return { data: user, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user basic information
   */
  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error updating last login:', error);
      return { error };
    }
  },
};

export default userService;