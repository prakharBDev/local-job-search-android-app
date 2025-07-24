import { apiClient, handleApiError } from './api';

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
      const { data: userRecord, error } = await apiClient.query('users', {
        select: '*',
        filters: { google_id: googleId },
        limit: 1,
        cache: true,
        cacheKey: `user_google_${googleId}`
      });

      if (error) {
        throw error;
      }

      return { exists: !!userRecord?.[0], userRecord: userRecord?.[0] || null, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'checkUserExists');
      return { exists: false, userRecord: null, error: apiError };
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
      const { data: userRecord, error: userError } = await apiClient.query('users', {
        select: 'city, onboarding_completed, last_onboarding_step',
        filters: { id: userId },
        limit: 1,
        cache: true,
        cacheKey: `user_onboarding_${userId}`
      });

      if (userError) {
        throw userError;
      }

      const user = userRecord?.[0];

      // If onboarding is already completed, skip all checks
      if (user?.onboarding_completed) {
        return { isComplete: true, missingSteps: [], error: null };
      }

      if (!user?.city) {
        missingSteps.push('city_selection');
      }

      // Check if user has roles selected
      const { data: seekerProfile, error: seekerError } = await apiClient.query('seeker_profiles', {
        select: 'id',
        filters: { user_id: userId },
        limit: 1,
        cache: true,
        cacheKey: `seeker_profile_${userId}`
      });

      if (seekerError) {
        throw seekerError;
      }

      const { data: companyProfile, error: companyError } = await apiClient.query('company_profiles', {
        select: 'id',
        filters: { user_id: userId },
        limit: 1,
        cache: true,
        cacheKey: `company_profile_${userId}`
      });

      if (companyError) {
        throw companyError;
      }

      if (!seekerProfile?.[0] && !companyProfile?.[0]) {
        missingSteps.push('role_selection');
      }

      // Check if profiles are complete
      if (seekerProfile?.[0]) {
        const seekerId = seekerProfile[0].id;

        const { data: seekerSkills, error: skillsError } = await apiClient.query('seeker_skills', {
          select: 'skill_id',
          filters: { seeker_id: seekerId },
          cache: true,
          cacheKey: `seeker_skills_${seekerId}`
        });

        if (skillsError) {
          throw skillsError;
        }

        const { data: seekerCategories, error: categoriesError } = await apiClient.query('seeker_categories', {
          select: 'category_id',
          filters: { seeker_id: seekerId },
          cache: true,
          cacheKey: `seeker_categories_${seekerId}`
        });

        if (categoriesError) {
          throw categoriesError;
        }

        // Check if profile has required fields
        const { data: seekerRecord, error: seekerRecordError } = await apiClient.query('seeker_profiles', {
          select: 'experience_level',
          filters: { id: seekerId },
          limit: 1,
          cache: true,
          cacheKey: `seeker_record_${seekerId}`
        });

        if (seekerRecordError) {
          throw seekerRecordError;
        }

        if (!seekerSkills?.length || !seekerCategories?.length || !seekerRecord?.[0]?.experience_level) {
          missingSteps.push('seeker_profile_incomplete');
        }
      }

      if (companyProfile?.[0]) {
        const companyId = companyProfile[0].id;

        // Check if company profile has required fields
        const { data: companyRecord, error: companyRecordError } = await apiClient.query('company_profiles', {
          select: 'company_name, contact_email',
          filters: { id: companyId },
          limit: 1,
          cache: true,
          cacheKey: `company_record_${companyId}`
        });

        if (companyRecordError) {
          throw companyRecordError;
        }

        if (!companyRecord?.[0]?.company_name || !companyRecord?.[0]?.contact_email) {
          missingSteps.push('company_profile_incomplete');
        }
      }

      const isComplete = missingSteps.length === 0;

      return { isComplete, missingSteps, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'checkProfileCompletion');
      return { isComplete: false, missingSteps: [], error: apiError };
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
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
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
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'createInitialUserRecord'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache(`user_google_${userData.id}`);
      apiClient.clearCache(`user_onboarding_${userData.id}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'createInitialUserRecord');
      return { data: null, error: apiError };
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
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('users')
            .update({
              ...updates,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();
          
          return { data, error };
        },
        { 
          cache: false, 
          retries: false,
          context: 'updateOnboardingProgress'
        }
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache(`user_onboarding_${userId}`);
      apiClient.clearCache(`user_google_${data?.google_id}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'updateOnboardingProgress');
      return { data: null, error: apiError };
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

      const { data: userRecord, error: userError } = await apiClient.query('users', {
        select: '*',
        filters: { id: userId },
        limit: 1,
        cache: true,
        cacheKey: `user_full_${userId}`
      });

      if (userError) {
        throw userError;
      }

      const user = userRecord?.[0];
      const nextScreen = this.determineNextScreen(user, missingSteps);

      return {
        status: {
          isComplete,
          missingSteps,
          nextScreen,
          userRecord: user,
          needsCitySelection: missingSteps.includes('city_selection'),
          needsRoleSelection: missingSteps.includes('role_selection'),
          needsProfileSetup: missingSteps.includes('seeker_profile_incomplete') || missingSteps.includes('company_profile_incomplete'),
        },
        error: null
      };
    } catch (error) {
      const apiError = handleApiError(error, 'getOnboardingStatus');
      return { status: null, error: apiError };
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService; 