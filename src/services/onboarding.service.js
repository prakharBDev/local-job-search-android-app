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
        cacheKey: `user_google_${googleId}`,
      });

      if (error) {
        throw error;
      }

      return {
        exists: !!userRecord?.[0],
        userRecord: userRecord?.[0] || null,
        error: null,
      };
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
      // Prevent duplicate calls within short time window and return cached result
      const now = Date.now();
      const cacheKey = `completion_check_${userId}`;
      if (this._lastCheck && this._lastCheck[cacheKey] && (now - this._lastCheck[cacheKey]) < 2000) {
        if (this._cachedResults && this._cachedResults[userId]) {
          return this._cachedResults[userId];
        }
      }
      
      this._lastCheck = this._lastCheck || {};
      this._lastCheck[cacheKey] = now;
      this._cachedResults = this._cachedResults || {};
      
      const missingSteps = [];

      // Check if user has city selected and onboarding status
      const { data: userRecord, error: userError } = await apiClient.query(
        'users',
        {
          select: 'id, email, name, city, phone_number, is_seeker, onboarding_completed, last_onboarding_step, created_at, updated_at',
          filters: { id: userId },
          limit: 1,
          cache: true,
          cacheKey: `user_onboarding_${userId}`,
        },
      );

      if (userError) {
        throw userError;
      }

      const user = userRecord?.[0];

      // Add safety check for undefined user
      if (!user) {
        console.warn('⚠️ [OnboardingService] User record not found for userId:', userId);
        return { isComplete: false, missingSteps: ['role_selection'], error: null };
      }

      // Check if onboarding is explicitly marked as completed
      if (user?.onboarding_completed === true) {
        // Query for the relevant profile based on user type
        let hasProfile = false;
        let seekerProfile = null;
        let companyProfile = null;
        
        if (user.is_seeker) {
          // Check seeker profile
          const { data: seekerProfileData, error: seekerError } = await apiClient.query(
            'seeker_profiles',
            {
              select: 'id',
              filters: { user_id: userId },
              limit: 1,
              cache: true,
              cacheKey: `seeker_profile_${userId}`,
            },
          );
          seekerProfile = seekerProfileData;
          hasProfile = !!seekerProfile?.[0];
        } else {
          // Check company profile
          const { data: companyProfileData, error: companyError } = await apiClient.query(
            'company_profiles',
            {
              select: 'id',
              filters: { user_id: userId },
              limit: 1,
              cache: true,
              cacheKey: `company_profile_${userId}`,
            },
          );
          companyProfile = companyProfileData;
          hasProfile = !!companyProfile?.[0];
        }
        
        if (!hasProfile) {
          console.log('⚠️ [OnboardingService] User marked as completed but has no profile, forcing onboarding');
          // Force onboarding if no profile exists
          return { isComplete: false, missingSteps: ['role_selection'], error: null };
        }
        
        // If user has a profile, check if it's actually complete
        if (user.is_seeker) {
          // Check seeker profile completeness
          const { data: seekerSkills, error: skillsError } =
            await apiClient.query('seeker_skills', {
              select: 'skill_id',
              filters: { seeker_id: seekerProfile[0].id },
              cache: true,
              cacheKey: `seeker_skills_${seekerProfile[0].id}`,
            });

          if (skillsError) {
            throw skillsError;
          }

          const { data: seekerCategories, error: categoriesError } =
            await apiClient.query('seeker_categories', {
              select: 'category_id',
              filters: { seeker_id: seekerProfile[0].id },
              cache: true,
              cacheKey: `seeker_categories_${seekerProfile[0].id}`,
            });

          if (categoriesError) {
            throw categoriesError;
          }

          const { data: seekerRecord, error: seekerRecordError } =
            await apiClient.query('seeker_profiles', {
              select: 'experience_level',
              filters: { id: seekerProfile[0].id },
              limit: 1,
              cache: true,
              cacheKey: `seeker_record_${seekerProfile[0].id}`,
            });

          if (seekerRecordError) {
            throw seekerRecordError;
          }

          if (
            !seekerSkills?.length ||
            !seekerCategories?.length ||
            !seekerRecord?.[0]?.experience_level
          ) {
            console.log('⚠️ [OnboardingService] User marked as completed but seeker profile is incomplete');
            return { isComplete: false, missingSteps: ['seeker_profile_incomplete'], error: null };
          }
        }

        if (!user.is_seeker) {
          // Check company profile completeness
          const { data: companyRecord, error: companyRecordError } =
            await apiClient.query('company_profiles', {
              select: 'company_name, contact_email',
              filters: { id: companyProfile[0].id },
              limit: 1,
              cache: true,
              cacheKey: `company_record_${companyProfile[0].id}`,
            });

          if (companyRecordError) {
            throw companyRecordError;
          }

          if (
            !companyRecord?.[0]?.company_name ||
            !companyRecord?.[0]?.contact_email
          ) {
            console.log('⚠️ [OnboardingService] User marked as completed but company profile is incomplete');
            return { isComplete: false, missingSteps: ['company_profile_incomplete'], error: null };
          }
        }

        // Only return complete if user has valid profiles
        return { isComplete: true, missingSteps: [], error: null };
      }

      // Always check for city selection first
      if (!user?.city) {
        missingSteps.push('city_selection');
      }

      // Check for the relevant profile based on user type
      let hasProfile = false;
      let seekerProfile = null;
      let companyProfile = null;
      
      if (user.is_seeker === true) {
        // Check seeker profile only
        const { data: seekerProfileData, error: seekerError } = await apiClient.query(
          'seeker_profiles',
          {
            select: 'id, experience_level, created_at',
            filters: { user_id: userId },
            limit: 1,
            cache: true,
            cacheKey: `seeker_profile_${userId}`,
          },
        );
        if (seekerError) {
          throw seekerError;
        }
        seekerProfile = seekerProfileData;
        hasProfile = !!seekerProfile?.[0];
      } else if (user.is_seeker === false) {
        // Check company profile only
        const { data: companyProfileData, error: companyError } = await apiClient.query(
          'company_profiles',
          {
            select: 'id, company_name, contact_email, created_at',
            filters: { user_id: userId },
            limit: 1,
            cache: true,
            cacheKey: `company_profile_${userId}`,
          },
        );
        if (companyError) {
          throw companyError;
        }
        companyProfile = companyProfileData;
        hasProfile = !!companyProfile?.[0];
      } else {
        // For new users (is_seeker is undefined), check both profile types
        const { data: seekerProfileData, error: seekerError } = await apiClient.query(
          'seeker_profiles',
          {
            select: 'id, experience_level, created_at',
            filters: { user_id: userId },
            limit: 1,
            cache: true,
            cacheKey: `seeker_profile_${userId}`,
          },
        );
        if (seekerError) {
          throw seekerError;
        }
        seekerProfile = seekerProfileData;

        const { data: companyProfileData, error: companyError } = await apiClient.query(
          'company_profiles',
          {
            select: 'id, company_name, contact_email, created_at',
            filters: { user_id: userId },
            limit: 1,
            cache: true,
            cacheKey: `company_profile_${userId}`,
          },
        );
        if (companyError) {
          throw companyError;
        }
        companyProfile = companyProfileData;
        
        // For new users, if either profile exists, they've made a choice
        hasProfile = !!(seekerProfile?.[0] || companyProfile?.[0]);
      }

      // If no profile exists, role selection is needed
      if (!hasProfile) {
        missingSteps.push('role_selection');
      }

      // Check if profiles are complete
      if (user.is_seeker === true && seekerProfile?.[0]) {
        const seekerId = seekerProfile[0].id;

        const { data: seekerSkills, error: skillsError } =
          await apiClient.query('seeker_skills', {
            select: 'skill_id',
            filters: { seeker_id: seekerId },
            cache: true,
            cacheKey: `seeker_skills_${seekerId}`,
          });

        if (skillsError) {
          throw skillsError;
        }

        const { data: seekerCategories, error: categoriesError } =
          await apiClient.query('seeker_categories', {
            select: 'category_id',
            filters: { seeker_id: seekerId },
            cache: true,
            cacheKey: `seeker_categories_${seekerId}`,
          });

        if (categoriesError) {
          throw categoriesError;
        }

        // Check if profile has required fields
        const { data: seekerRecord, error: seekerRecordError } =
          await apiClient.query('seeker_profiles', {
            select: 'experience_level',
            filters: { id: seekerId },
            limit: 1,
            cache: true,
            cacheKey: `seeker_record_${seekerId}`,
          });

        if (seekerRecordError) {
          throw seekerRecordError;
        }

        if (
          !seekerSkills?.length ||
          !seekerCategories?.length ||
          !seekerRecord?.[0]?.experience_level
        ) {
          missingSteps.push('seeker_profile_incomplete');
        }
      }

      if (user.is_seeker === false && companyProfile?.[0]) {
        const companyId = companyProfile[0].id;
        console.log('🏢 [OnboardingService] Found company profile, checking completeness. Company ID:', companyId);

        // If user has reached OnboardingSuccess before, don't make them go through setup again
        if (user?.last_onboarding_step === 'completed' || user?.onboarding_completed) {
          console.log('✅ [OnboardingService] User has completed onboarding before, profile is considered complete');
        } else {
          // Check if company profile has required fields
          const { data: companyRecord, error: companyRecordError } =
            await apiClient.query('company_profiles', {
              select: 'company_name, contact_email',
              filters: { id: companyId },
              limit: 1,
              cache: true,
              cacheKey: `company_record_${companyId}`,
            });

          if (companyRecordError) {
            throw companyRecordError;
          }

          if (
            !companyRecord?.[0]?.company_name ||
            !companyRecord?.[0]?.contact_email
          ) {
            missingSteps.push('company_profile_incomplete');
          }
        }
      }

      // For new users (is_seeker is undefined), check both profile types for completeness
      if (user.is_seeker === undefined) {
        if (seekerProfile?.[0]) {
          // User has a seeker profile, check its completeness
          const seekerId = seekerProfile[0].id;

          const { data: seekerSkills, error: skillsError } =
            await apiClient.query('seeker_skills', {
              select: 'skill_id',
              filters: { seeker_id: seekerId },
              cache: true,
              cacheKey: `seeker_skills_${seekerId}`,
            });

          if (skillsError) {
            throw skillsError;
          }

          const { data: seekerCategories, error: categoriesError } =
            await apiClient.query('seeker_categories', {
              select: 'category_id',
              filters: { seeker_id: seekerId },
              cache: true,
              cacheKey: `seeker_categories_${seekerId}`,
            });

          if (categoriesError) {
            throw categoriesError;
          }

          const { data: seekerRecord, error: seekerRecordError } =
            await apiClient.query('seeker_profiles', {
              select: 'experience_level',
              filters: { id: seekerId },
              limit: 1,
              cache: true,
              cacheKey: `seeker_record_${seekerId}`,
            });

          if (seekerRecordError) {
            throw seekerRecordError;
          }

          if (
            !seekerSkills?.length ||
            !seekerCategories?.length ||
            !seekerRecord?.[0]?.experience_level
          ) {
            missingSteps.push('seeker_profile_incomplete');
          }
        }

        if (companyProfile?.[0]) {
          // User has a company profile, check its completeness
          const companyId = companyProfile[0].id;

          // If user has reached OnboardingSuccess before, don't make them go through setup again
          if (user?.last_onboarding_step === 'completed' || user?.onboarding_completed) {
            console.log('✅ [OnboardingService] User has completed onboarding before, profile is considered complete');
          } else {
            const { data: companyRecord, error: companyRecordError } =
              await apiClient.query('company_profiles', {
                select: 'company_name, contact_email',
                filters: { id: companyId },
                limit: 1,
                cache: true,
                cacheKey: `company_record_${companyId}`,
              });

            if (companyRecordError) {
              throw companyRecordError;
            }

            if (
              !companyRecord?.[0]?.company_name ||
              !companyRecord?.[0]?.contact_email
            ) {
              missingSteps.push('company_profile_incomplete');
            }
          }
        }
      }

      const isComplete = missingSteps.length === 0;

      const result = { isComplete, missingSteps, error: null };
      this._cachedResults[userId] = result;
      return result;
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
    // Only log if there are missing steps (something needs to be done)
    if (missingSteps.length > 0) {
      console.log('🧭 [OnboardingService] Missing steps found:', missingSteps);
    }

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
              name:
                userData.user_metadata?.full_name ||
                userData.email?.split('@')[0],
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
          context: 'createInitialUserRecord',
        },
      );

      if (error) {
        throw error;
      }

      // Clear related caches
      apiClient.clearCache(`user_google_${userData.id}`);
      apiClient.clearCache(`user_onboarding_${userData.id}`);

    } catch (error) {
      const apiError = handleApiError(error, 'createInitialUserRecord');
      return { data: null, error: apiError };
    }
  }

  /**
   * Clear cached onboarding results for a user
   * @param {string} userId - User ID
   */
  clearOnboardingCache(userId) {
    if (this._cachedResults && this._cachedResults[userId]) {
      delete this._cachedResults[userId];
      console.log('🧹 [OnboardingService] Cleared onboarding cache for user:', userId);
    }
    if (this._lastCheck) {
      const cacheKey = `completion_check_${userId}`;
      if (this._lastCheck[cacheKey]) {
        delete this._lastCheck[cacheKey];
      }
    }
    // Also clear API client caches
    apiClient.clearCache(`user_onboarding_${userId}`);
    apiClient.clearCache(`user_full_${userId}`);
    apiClient.clearCache(`seeker_profile_${userId}`);
    apiClient.clearCache(`company_profile_${userId}`);
    console.log('🧹 [OnboardingService] Cleared all related caches for user:', userId);
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
          context: 'updateOnboardingProgress',
        },
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
   * Debug helper: Reset onboarding status and clear all caches
   * @param {string} userId - User ID
   */
  async debugResetOnboarding(userId) {
    console.log('🔧 [OnboardingService] DEBUG: Resetting onboarding for user:', userId);
    
    // Clear all caches first
    this.clearOnboardingCache(userId);
    
    // Reset onboarding status
    const { error } = await apiClient.supabase
      .from('users')
      .update({
        onboarding_completed: false,
        last_onboarding_step: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ [OnboardingService] Failed to reset onboarding:', error);
    } else {
      console.log('✅ [OnboardingService] Successfully reset onboarding status');
    }

    return !error;
  }

  /**
   * Fix incomplete company profile by adding missing contact_email
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, error: Error|null}>}
   */
  async fixIncompleteCompanyProfile(userId) {
    try {
      console.log('🔧 [OnboardingService] Fixing incomplete company profile for user:', userId);
      
      // Get user email
      const { data: userRecord, error: userError } = await apiClient.query('users', {
        select: 'email',
        filters: { id: userId },
        limit: 1,
      });

      if (userError) {
        throw userError;
      }

      const userEmail = userRecord?.[0]?.email;
      if (!userEmail) {
        throw new Error('User email not found');
      }

      // Get company profile
      const { data: companyProfile, error: companyError } = await apiClient.query('company_profiles', {
        select: 'id, contact_email',
        filters: { user_id: userId },
        limit: 1,
      });

      if (companyError) {
        throw companyError;
      }

      const profile = companyProfile?.[0];
      if (!profile) {
        throw new Error('Company profile not found');
      }

      // Update profile with contact_email if missing
      if (!profile.contact_email) {
        console.log('📧 [OnboardingService] Adding missing contact_email to company profile');
        const { error: updateError } = await apiClient.supabase
          .from('company_profiles')
          .update({ contact_email: userEmail })
          .eq('id', profile.id);

        if (updateError) {
          throw updateError;
        }

        console.log('✅ [OnboardingService] Successfully updated company profile with contact_email');
      }

      // Mark onboarding as completed
      const { error: userUpdateError } = await apiClient.supabase
        .from('users')
        .update({
          onboarding_completed: true,
          last_onboarding_step: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (userUpdateError) {
        throw userUpdateError;
      }

      console.log('✅ [OnboardingService] Successfully marked onboarding as completed');
      
      // Clear cache
      this.clearOnboardingCache(userId);

      return { success: true, error: null };
    } catch (error) {
      console.error('❌ [OnboardingService] Error fixing company profile:', error);
      return { success: false, error };
    }
  }

  /**
   * Get onboarding flow status for a user
   * @param {string} userId - User ID
   * @returns {Promise<{status: Object, error: Error|null}>}
   */
  async getOnboardingStatus(userId) {
    try {
      
      const {
        isComplete,
        missingSteps,
        error: completionError,
      } = await this.checkProfileCompletion(userId);


      if (completionError) {
        throw completionError;
      }

      const { data: userRecord, error: userError } = await apiClient.query(
        'users',
        {
          select: 'id, email, name, city, phone_number, is_seeker, onboarding_completed, last_onboarding_step, created_at, updated_at',
          filters: { id: userId },
          limit: 1,
          cache: true,
          cacheKey: `user_full_${userId}`,
        },
      );


      if (userError) {
        throw userError;
      }

      const user = userRecord?.[0];
      
      // Add safety check for undefined user
      if (!user) {
        console.warn('⚠️ [OnboardingService] User record not found in getOnboardingStatus for userId:', userId);
        return {
          status: {
            isComplete: false,
            missingSteps: ['role_selection'],
            nextScreen: 'Onboarding',
            userRecord: null,
            needsCitySelection: true,
            needsRoleSelection: true,
            needsProfileSetup: true,
            userRoles: {
              isSeeker: false,
              isCompany: false,
              isPoster: false,
            },
          },
          error: null,
        };
      }
      
      const nextScreen = this.determineNextScreen(user, missingSteps);

      // Check for existing profiles to determine user roles
      const { data: seekerProfile, error: seekerError } = await apiClient.query(
        'seeker_profiles',
        {
          select: 'id',
          filters: { user_id: userId },
          limit: 1,
          cache: true,
          cacheKey: `seeker_profile_${userId}`,
        },
      );

      if (seekerError) {
        console.warn('⚠️ [OnboardingService] Error fetching seeker profile:', seekerError);
      }

      const { data: companyProfile, error: companyError } = await apiClient.query(
        'company_profiles',
        {
          select: 'id',
          filters: { user_id: userId },
          limit: 1,
          cache: true,
          cacheKey: `company_profile_${userId}`,
        },
      );

      if (companyError) {
        console.warn('⚠️ [OnboardingService] Error fetching company profile:', companyError);
      }


      // Determine user roles based on is_seeker flag, with fallback to profile existence
      let isSeeker = user?.is_seeker;
      
      // If is_seeker is undefined, infer from existing profiles
      if (isSeeker === undefined) {
        if (companyProfile?.[0] && !seekerProfile?.[0]) {
          isSeeker = false; // Has company profile only -> company user
        } else if (seekerProfile?.[0] && !companyProfile?.[0]) {
          isSeeker = true;  // Has seeker profile only -> seeker user
        }
        // If both or neither exist, leave as undefined for role selection
      }

      const userRoles = {
        isSeeker: isSeeker === true,
        isCompany: isSeeker === false,
        isPoster: isSeeker === false,  // alias for company
      };


      // Only log user roles if there's something noteworthy
      if (isSeeker === undefined) {
        console.log('⚠️ [OnboardingService] User role not determined, showing role selection');
      }

      const status = {
        isComplete,
        missingSteps,
        nextScreen,
        userRecord: user,
        needsCitySelection: missingSteps.includes('city_selection'),
        needsRoleSelection: missingSteps.includes('role_selection'),
        needsProfileSetup:
          missingSteps.includes('seeker_profile_incomplete') ||
          missingSteps.includes('company_profile_incomplete'),
        userRoles,
      };


      return {
        status,
        error: null,
      };
    } catch (error) {
      console.error('❌ [OnboardingService] getOnboardingStatus error:', error);
      const apiError = handleApiError(error, 'getOnboardingStatus');
      return { status: null, error: apiError };
    }
  }

  /**
   * Reset onboarding progress for a user
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async resetOnboardingProgress(userId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('users')
            .update({
              onboarding_completed: false,
              last_onboarding_step: null,
              city: null, // Reset city selection
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
          context: 'resetOnboardingProgress',
        },
      );

      if (error) {
        throw error;
      }

      // Clear all related caches
      this.clearOnboardingCache(userId);
      apiClient.clearCache(`user_onboarding_${userId}`);
      apiClient.clearCache(`user_full_${userId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'resetOnboardingProgress');
      return { data: null, error: apiError };
    }
  }

  /**
   * Mark onboarding as completed
   * @param {string} userId - User ID
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  async completeOnboarding(userId) {
    try {
      const { data, error } = await apiClient.request(
        async () => {
          const { data, error } = await apiClient.supabase
            .from('users')
            .update({
              onboarding_completed: true,
              last_onboarding_step: 'completed',
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
          context: 'completeOnboarding',
        },
      );

      if (error) {
        throw error;
      }

      // Clear all related caches
      this.clearOnboardingCache(userId);
      apiClient.clearCache(`user_onboarding_${userId}`);
      apiClient.clearCache(`user_full_${userId}`);

      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, 'completeOnboarding');
      return { data: null, error: apiError };
    }
  }
}

export const onboardingService = new OnboardingService();
export default onboardingService;
