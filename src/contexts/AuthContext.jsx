import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import { onboardingService } from '../services';

/**
 * Auth State Types
 */
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_SESSION: 'SET_SESSION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ONBOARDING_STATUS: 'SET_ONBOARDING_STATUS',
  LOGOUT: 'LOGOUT',
};

/**
 * Initial Auth State
 * Preserving ALL original state properties
 */
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
    isPoster: false,
  },
  error: null,
};

/**
 * Auth Reducer
 * Optimized for predictable state updates
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case AUTH_ACTIONS.SET_USER:
      // Automatically determine user roles based on is_seeker field
      let userRoles = {
        isSeeker: false,
        isCompany: false,
        isPoster: false,
      };
      
      if (action.payload.userRecord?.is_seeker !== undefined) {
        userRoles = {
          isSeeker: action.payload.userRecord.is_seeker,
          isCompany: !action.payload.userRecord.is_seeker,
          isPoster: !action.payload.userRecord.is_seeker,
        };
      }

      return {
        ...state,
        user: action.payload.user,
        userRecord: action.payload.userRecord,
        isAuthenticated: !!action.payload.user,
        userRoles,
      };

    case AUTH_ACTIONS.SET_SESSION:
      return { ...state, session: action.payload };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.SET_ONBOARDING_STATUS:
      // Update user roles if provided in onboarding status
      let updatedUserRoles = state.userRoles;
      if (action.payload.userRoles) {
        updatedUserRoles = action.payload.userRoles;
      } else if (action.payload.userRecord?.is_seeker !== undefined) {
        updatedUserRoles = {
          isSeeker: action.payload.userRecord.is_seeker,
          isCompany: !action.payload.userRecord.is_seeker,
          isPoster: !action.payload.userRecord.is_seeker,
        };
      }

      return {
        ...state,
        needsCitySelection: action.payload.needsCitySelection,
        needsProfileSetup: action.payload.needsProfileSetup,
        needsRoleSelection: action.payload.needsRoleSelection,
        userRoles: updatedUserRoles,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
};

/**
 * Auth Context
 */
const AuthContext = createContext();

/**
 * Auth Provider Component
 * Optimized for performance with proper memoization and reduced re-renders
 * FULLY BACKWARD COMPATIBLE with original AuthContext.jsx API
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Memoize the signInWithGoogle function
  const signInWithGoogle = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'jobportal://auth/callback',
        },
      });

      if (error) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
        return { error: error.message };
      }

      return { data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { error: error.message };
    }
  }, []);

  // Memoize the logout function
  const logout = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        'user_session',
        'user_data',
        'onboarding_status',
      ]);

      // Sign out from Supabase
      await supabase.auth.signOut();

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Add updateUserRecord function
  const updateUserRecord = useCallback(
    async updates => {
      try {
        if (!state.user?.id) {
          throw new Error('No user found');
        }

        // Update user metadata in Supabase
        const { data, error } = await supabase.auth.updateUser({
          data: updates,
        });

        if (error) {
          throw error;
        }

        // Also update the users table for phone_number and city
        const userTableUpdates = {};
        if (updates.phone_number) {
          userTableUpdates.phone_number = updates.phone_number;
        }
        if (updates.phone) {
          userTableUpdates.phone_number = updates.phone;
        }
        if (updates.city) {
          userTableUpdates.city = updates.city;
        }

        if (Object.keys(userTableUpdates).length > 0) {
          const { error: userTableError } = await supabase
            .from('users')
            .update(userTableUpdates)
            .eq('id', state.user.id);

          if (userTableError) {
            console.error('Error updating users table:', userTableError);
          }
        }

        // Update local state
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            user: data.user,
            userRecord: { ...state.userRecord, ...updates, ...userTableUpdates },
          },
        });

        return { data, error: null };
      } catch (error) {
        console.error('Error updating user record:', error);
        return { data: null, error };
      }
    },
    [state.user?.id, state.userRecord],
  );

  // Memoize the updateUserProfile function
  const updateUserProfile = useCallback(async profileData => {
    try {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const { data, error } = await supabase.auth.updateUser(profileData);

      if (error) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
        return { error: error.message };
      }

      if (data.user) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: data.user, userRecord: data.user },
        });
      }

      return { data };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      return { error: error.message };
    }
  }, []);

  // Memoize the login function for Google Sign-In with phone number
  const login = useCallback(async ({ session, user, userRecord, isNewUser, phoneNumber }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      // Store session and user data
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: { user, userRecord },
      });
      dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: session });

      // Store session in AsyncStorage
      await AsyncStorage.setItem('user_session', JSON.stringify(session));
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      // Check onboarding status
      try {
        const { status: onboardingStatus, error: onboardingError } =
          await onboardingService.getOnboardingStatus(user.id);

        if (onboardingError) {
          throw onboardingError;
        }

        console.log('🎭 [AuthContext] Setting user roles from onboarding service:', {
          userRoles: onboardingStatus.userRoles || [],
          needsCitySelection: onboardingStatus.needsCitySelection,
          needsProfileSetup: onboardingStatus.needsProfileSetup,
          needsRoleSelection: onboardingStatus.needsRoleSelection,
          onboardingComplete: onboardingStatus.isComplete
        });

        dispatch({
          type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
          payload: {
            needsCitySelection: onboardingStatus.needsCitySelection,
            needsProfileSetup: onboardingStatus.needsProfileSetup,
            needsRoleSelection: onboardingStatus.needsRoleSelection,
            userRoles: onboardingStatus.userRoles || [],
          },
        });

        // Store onboarding status
        await AsyncStorage.setItem('onboarding_status', JSON.stringify(onboardingStatus));
      } catch (onboardingError) {
        console.warn('Failed to get onboarding status:', onboardingError);
        // Set default onboarding status for new users
        const defaultStatus = {
          needsCitySelection: isNewUser,
          needsProfileSetup: isNewUser,
          needsRoleSelection: isNewUser,
          userRoles: [],
        };
        
        dispatch({
          type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
          payload: defaultStatus,
        });

        await AsyncStorage.setItem('onboarding_status', JSON.stringify(defaultStatus));
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { error: error.message };
    }
  }, []);

  // Memoize the clearError function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Memoize the checkAuthStatus function
  const checkAuthStatus = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
        return;
      }

      if (session?.user) {
        // Fetch user data from the users table to get phone_number and other fields
        let userRecord = session.user;
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!userError && userData) {
            // Merge auth user data with database user data
            userRecord = {
              ...session.user,
              ...userData,
            };
          }
        } catch (userError) {
          console.warn('Failed to fetch user data from users table:', userError);
          // Fallback to just auth user data
          userRecord = session.user;
        }

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: session.user, userRecord },
        });
        dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: session });

        // Check onboarding status
        try {
          const { status: onboardingStatus, error: onboardingError } =
            await onboardingService.getOnboardingStatus(session.user.id);

          if (onboardingError) {
            throw onboardingError;
          }

          dispatch({
            type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
            payload: {
              needsCitySelection: onboardingStatus.needsCitySelection,
              needsProfileSetup: onboardingStatus.needsProfileSetup,
              needsRoleSelection: onboardingStatus.needsRoleSelection,
              userRoles: onboardingStatus.userRoles || [],
            },
          });
        } catch (onboardingError) {
          console.warn('Failed to get onboarding status:', onboardingError);
          // Set default onboarding status
          dispatch({
            type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
            payload: {
              needsCitySelection: true,
              needsProfileSetup: true,
              needsRoleSelection: true,
              userRoles: {
                isSeeker: false,
                isCompany: false,
                isPoster: false,
              },
            },
          });
        }
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user data from the users table to get phone_number and other fields
        let userRecord = session.user;
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!userError && userData) {
            // Merge auth user data with database user data
            userRecord = {
              ...session.user,
              ...userData,
            };
          }
        } catch (userError) {
          console.warn('Failed to fetch user data from users table:', userError);
          // Fallback to just auth user data
          userRecord = session.user;
        }

        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: { user: session.user, userRecord },
        });
        dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: session });

        // Check onboarding status for new sign-ins
        try {
          const { status: onboardingStatus, error: onboardingError } =
            await onboardingService.getOnboardingStatus(session.user.id);

          if (onboardingError) {
            throw onboardingError;
          }

          dispatch({
            type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
            payload: {
              needsCitySelection: onboardingStatus.needsCitySelection,
              needsProfileSetup: onboardingStatus.needsProfileSetup,
              needsRoleSelection: onboardingStatus.needsRoleSelection,
              userRoles: onboardingStatus.userRoles || [],
            },
          });
        } catch (onboardingError) {
          console.warn('Failed to get onboarding status:', onboardingError);
          dispatch({
            type: AUTH_ACTIONS.SET_ONBOARDING_STATUS,
            payload: {
              needsCitySelection: true,
              needsProfileSetup: true,
              needsRoleSelection: true,
              userRoles: [],
            },
          });
        }
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    });

    // Initial auth check
    checkAuthStatus();

    return () => subscription.unsubscribe();
  }, [checkAuthStatus]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      ...state,

      // Actions
      signInWithGoogle,
      login,
      logout,
      updateUserRecord,
      updateUserProfile,
      clearError,
      checkAuthStatus,
    }),
    [
      state,
      signInWithGoogle,
      login,
      logout,
      updateUserRecord,
      updateUserProfile,
      clearError,
      checkAuthStatus,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * FULLY BACKWARD COMPATIBLE with original useAuth hook
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Granular hook for auth status only
 * Optimized for components that only need authentication status
 */
export const useAuthStatus = () => {
  const { isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading };
};

/**
 * Granular hook for user data only
 * Optimized for components that only need user information
 */
export const useUser = () => {
  const { user, userRecord } = useAuth();
  return { user, userRecord };
};

export default AuthContext;
