import { supabase } from '../utils/supabase';

/**
 * Onboarding Service
 * Handles onboarding flow logic, user existence checks, and navigation decisions
 */
class OnboardingService {
  /**
   * Check if user exists in database by Google ID
   * @param {string} googleId - Google user ID
   * @returns {Promise<{exists: boolean, userRecord: Object|null, error: Error|null}>}
   */
  async checkUserExists(googleId) {
    try {
      const { data: userRecord, error } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleId)
        .single();

      if (error && error.code === 'PGRST116') {
        // User not found
        return { exists: false, userRecord: null, error: null };
      }

      if (error) {
        throw error;
      }

      return { exists: true, userRecord, error: null };
    } catch (error) {
      console.error('Error checking user existence:', error);
      return { exists: false, userRecord: null, error };
    }
  }

  /**
   * Check if user has complete profile setup
   * @param {string} userId - User ID
   * @returns {Promise<{isComplete: boolean, missingSteps: Array, error: Error|null}>}
   */
  async checkProfileCompletion(userId) {
    try {
      const missingSteps = [];

      // Check if user has city selected and onboarding status
      const { data: userRecord } = await supabase
        .from('users')
        .select('city, onboarding_completed, last_onboarding_step')
        .eq('id', userId)
        .single();

      // If onboarding is already completed, skip all checks
      if (userRecord?.onboarding_completed) {
        return { isComplete: true, missingSteps: [], error: null };
      }

      if (!userRecord?.city) {
        missingSteps.push('city_selection');
      }

      // Check if user has roles selected
      const { data: seekerProfile } = await supabase
        .from('seeker_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      const { data: companyProfile } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (!seekerProfile && !companyProfile) {
        missingSteps.push('role_selection');
      }

      // Check if profiles are complete
      if (seekerProfile) {
        const { data: seekerSkills } = await supabase
          .from('seeker_skills')
          .select('skill_id')
          .eq('seeker_id', seekerProfile.id);

        const { data: seekerCategories } = await supabase
          .from('seeker_categories')
          .select('category_id')
          .eq('seeker_id', seekerProfile.id);

        // Check if profile has required fields
        const { data: seekerRecord } = await supabase
          .from('seeker_profiles')
          .select('experience_level')
          .eq('id', seekerProfile.id)
          .single();

        if (!seekerSkills?.length || !seekerCategories?.length || !seekerRecord?.experience_level) {
          missingSteps.push('seeker_profile_incomplete');
        }
      }

      if (companyProfile) {
        // Check if company profile has required fields
        const { data: companyRecord } = await supabase
          .from('company_profiles')
          .select('company_name, contact_email')
          .eq('id', companyProfile.id)
          .single();

        if (!companyRecord?.company_name || !companyRecord?.contact_email) {
          missingSteps.push('company_profile_incomplete');
        }
      }

      const isComplete = missingSteps.length === 0;

      return { isComplete, missingSteps, error: null };
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return { isComplete: false, missingSteps: [], error };
    }
  }

  /**
   * Determine the next screen in onboarding flow
   * @param {Object} userRecord - User record from database
   * @param {Array} missingSteps - Missing steps from profile completion check
   * @returns {string} Next screen name
   */
  determineNextScreen(userRecord, missingSteps) {
    if (missingSteps.includes('city_selection')) {
      return 'CitySelection';
    }

    if (missingSteps.includes('role_selection')) {
      return 'Onboarding';
    }

    if (missingSteps.includes('seeker_profile_incomplete')) {
      return 'SeekerProfileSetup';
    }

    if (missingSteps.includes('company_profile_incomplete')) {
      return 'CompanyProfileSetup';
    }

    // All steps complete
    return 'Main';
  }

  /**
   * Create initial user record for new users
   * @param {Object} userData - User data from Google authentication
   * @param {string} phoneNumber - Phone number from login
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async createInitialUserRecord(userData, phoneNumber) {
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userData.id,
          email: userData.email,
          name: userData.user_metadata?.full_name || userData.email?.split('@')[0],
          phone_number: phoneNumber,
          google_id: userData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating initial user record:', error);
      return { data: null, error };
    }
  }

  /**
   * Update user's onboarding progress
   * @param {string} userId - User ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async updateOnboardingProgress(userId, updates) {
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
      console.error('Error updating onboarding progress:', error);
      return { data: null, error };
    }
  }

  /**
   * Get onboarding flow status for a user
   * @param {string} userId - User ID
   * @returns {Promise<{status: Object, error: Error|null}>}
   */
  async getOnboardingStatus(userId) {
    try {
      const { isComplete, missingSteps, error: completionError } = await this.checkProfileCompletion(userId);
      
      if (completionError) {
        throw completionError;
      }

      const { data: userRecord } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const nextScreen = this.determineNextScreen(userRecord, missingSteps);

      return {
        status: {
          isComplete,
          missingSteps,
          nextScreen,
          userRecord,
          needsCitySelection: missingSteps.includes('city_selection'),
          needsRoleSelection: missingSteps.includes('role_selection'),
          needsProfileSetup: missingSteps.includes('seeker_profile_incomplete') || missingSteps.includes('company_profile_incomplete'),
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting onboarding status:', error);
      return { status: null, error };
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService; 