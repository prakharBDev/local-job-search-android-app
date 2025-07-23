import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearErrorHelper } from '../utils/clearError.js';
import { supabase } from '../utils/supabase.js';
import { onboardingService } from '../services';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userRecord: null,
  session: null,
  needsCitySelection: false,
  needsProfileSetup: false,
  needsRoleSelection: false,
  userRoles: {
    isSeeker: false,
    isCompany: false,
    hasSelectedRoles: false,
  },
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        userRecord: action.payload.userRecord,
        session: action.payload.session,
        needsCitySelection: action.payload.needsCitySelection || false,
        needsProfileSetup: action.payload.needsProfileSetup || false,
        needsRoleSelection: action.payload.needsRoleSelection || false,
        userRoles: action.payload.userRoles || {
          isSeeker: false,
          isCompany: false,
          hasSelectedRoles: false,
        },
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userRecord: null,
        session: null,
        needsCitySelection: false,
        needsProfileSetup: false,
        needsRoleSelection: false,
        userRoles: {
          isSeeker: false,
          isCompany: false,
          hasSelectedRoles: false,
        },
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        userRecord: null,
        session: null,
        needsCitySelection: false,
        needsProfileSetup: false,
        needsRoleSelection: false,
        userRoles: {
          isSeeker: false,
          isCompany: false,
          hasSelectedRoles: false,
        },
        error: null,
      };
    case 'AUTH_RESTORE':
      return {
        ...state,
        isAuthenticated: action.payload?.session !== null,
        isLoading: false,
        user: action.payload?.user || null,
        userRecord: action.payload?.userRecord || null,
        session: action.payload?.session || null,
        needsCitySelection: action.payload?.needsCitySelection || false,
        needsProfileSetup: action.payload?.needsProfileSetup || false,
        needsRoleSelection: action.payload?.needsRoleSelection || false,
        userRoles: action.payload?.userRoles || {
          isSeeker: false,
          isCompany: false,
          hasSelectedRoles: false,
        },
        error: null,
      };
    case 'UPDATE_USER_RECORD':
      return {
        ...state,
        userRecord: action.payload.userRecord,
        needsCitySelection: action.payload.needsCitySelection || false,
        needsProfileSetup: action.payload.needsProfileSetup || false,
        needsRoleSelection: action.payload.needsRoleSelection || false,
        userRoles: action.payload.userRoles || state.userRoles,
      };
    default:
      return state;
  }
};

const AUTH_STORAGE_KEY = 'AUTH_USER_DATA';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getUserRoles = async userId => {
    try {
      // Check for seeker profile
      const { data: seekerProfile, error: seekerError } = await supabase
        .from('seeker_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      // Check for company profile
      const { data: companyProfile, error: companyError } = await supabase
        .from('company_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      const isSeeker = seekerProfile && !seekerError;
      const isCompany = companyProfile && !companyError;
      const hasSelectedRoles = isSeeker || isCompany;

      return {
        isSeeker,
        isCompany,
        hasSelectedRoles,
      };
    } catch (error) {
      console.error('Error checking user roles:', error);
      return {
        isSeeker: false,
        isCompany: false,
        hasSelectedRoles: false,
      };
    }
  };

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session?.user) {
        // Use onboarding service to get comprehensive status
        const { status, error: statusError } = await onboardingService.getOnboardingStatus(session.user.id);
        
        if (statusError) {
          throw statusError;
        }

        const userRoles = await getUserRoles(session.user.id);

        dispatch({
          type: 'AUTH_RESTORE',
          payload: {
            session,
            user: session.user,
            userRecord: status.userRecord,
            needsCitySelection: status.needsCitySelection,
            needsProfileSetup: status.needsProfileSetup,
            needsRoleSelection: status.needsRoleSelection,
            userRoles,
          },
        });
      } else {
        dispatch({ type: 'AUTH_RESTORE', payload: null });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Failed to check authentication status',
      });
    }
  };

  const login = async authData => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      const { session, user, userRecord, isNewUser, phoneNumber } = authData;

      if (!session || !user) {
        throw new Error('Invalid authentication data');
      }

      let finalUserRecord = userRecord;

      // If this is a new user and we have a phone number, create/update the user record
      if (isNewUser && phoneNumber) {
        try {
          const { data: newUserRecord, error: createError } = await onboardingService.createInitialUserRecord(user, phoneNumber);
          
          if (createError) {
            console.error('Error creating user record:', createError);
            // Continue without phone number if creation fails
          } else {
            finalUserRecord = newUserRecord;
          }
        } catch (createError) {
          console.error('Error creating user record:', createError);
          // Continue without phone number if creation fails
        }
      }

      // Use onboarding service to get comprehensive status
      const { status, error: statusError } = await onboardingService.getOnboardingStatus(user.id);
      
      if (statusError) {
        throw statusError;
      }

      const userRoles = await getUserRoles(user.id);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          session,
          user,
          userRecord: finalUserRecord || status.userRecord,
          needsCitySelection: status.needsCitySelection,
          needsProfileSetup: status.needsProfileSetup,
          needsRoleSelection: status.needsRoleSelection,
          userRoles,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Login failed. Please try again.',
      });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      // First, clear any stored data
      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        'USER_MODE_PREFERENCE',
        'NAVIGATION_STATE_V1', // Clear navigation state too
      ]);

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear any remaining state
      dispatch({ type: 'AUTH_LOGOUT' });

      // Return success
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if there's an error, we should still clear local state
      dispatch({ type: 'AUTH_LOGOUT' });
      
      // Try to clear storage again as a fallback
      try {
        await AsyncStorage.multiRemove([
          AUTH_STORAGE_KEY,
          'USER_MODE_PREFERENCE',
          'NAVIGATION_STATE_V1',
        ]);
      } catch (storageError) {
        console.error('Storage cleanup error:', storageError);
      }
      
      throw error;
    }
  };

  const updateUserRecord = async updates => {
    try {
      if (!state.userRecord?.id) {
        throw new Error('No user record to update');
      }

      // Handle potential schema issues
      const safeUpdates = { ...updates };
      
      // Remove any fields that might not exist in the current schema
      const knownFields = ['city', 'is_seeker', 'name', 'email', 'phone_number', 'google_id', 'last_login_at', 'updated_at'];
      Object.keys(safeUpdates).forEach(key => {
        if (!knownFields.includes(key)) {
          console.warn(`Field '${key}' removed from update to avoid potential schema issues`);
          delete safeUpdates[key];
        }
      });

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...safeUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.userRecord.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        
        // Handle specific schema errors
        if (error.code === 'PGRST204' && error.message.includes('column')) {
          console.warn('Schema mismatch detected. Some fields may not exist in the current database schema.');
          // Try to update with only basic fields
          const basicUpdates = {
            city: safeUpdates.city,
            name: safeUpdates.name,
            phone_number: safeUpdates.phone_number,
            updated_at: new Date().toISOString(),
          };
          
          const { data: basicUpdatedUser, error: basicError } = await supabase
            .from('users')
            .update(basicUpdates)
            .eq('id', state.userRecord.id)
            .select()
            .single();
            
          if (basicError) {
            throw basicError;
          }
          
          return basicUpdatedUser;
        }
        
        throw error;
      }

      // Use onboarding service to get updated status
      const { status, error: statusError } = await onboardingService.getOnboardingStatus(updatedUser.id);
      
      if (statusError) {
        throw statusError;
      }

      const userRoles = await getUserRoles(updatedUser.id);

      dispatch({
        type: 'UPDATE_USER_RECORD',
        payload: {
          userRecord: updatedUser,
          needsCitySelection: status.needsCitySelection,
          needsProfileSetup: status.needsProfileSetup,
          needsRoleSelection: status.needsRoleSelection,
          userRoles,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error('Update user record error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Failed to update user profile',
      });
      throw error;
    }
  };

  const clearError = () => {
    if (state.error) {
      clearErrorHelper(dispatch, 'AUTH_RESTORE', {
        session: state.session,
        user: state.user,
        userRecord: state.userRecord,
        needsCitySelection: state.needsCitySelection,
        needsProfileSetup: state.needsProfileSetup,
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch({ type: 'AUTH_LOGOUT' });
      } else if (event === 'SIGNED_IN' && session) {
        // This will be handled by the GoogleSignInButton callback
        // to avoid duplicate user creation
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const contextValue = {
    state,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    userRecord: state.userRecord,
    session: state.session,
    needsCitySelection: state.needsCitySelection,
    needsProfileSetup: state.needsProfileSetup,
    needsRoleSelection: state.needsRoleSelection,
    userRoles: state.userRoles,
    error: state.error,
    login,
    logout,
    updateUserRecord,
    checkAuthStatus,
    clearError,
    getUserRoles,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthContext };
