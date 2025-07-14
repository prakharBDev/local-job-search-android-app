import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearErrorHelper } from '../utils/clearError.js';
import { supabase } from '../utils/supabase.js';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userRecord: null,
  session: null,
  needsCitySelection: false,
  needsProfileSetup: false,
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
        error: null,
      };
    case 'UPDATE_USER_RECORD':
      return {
        ...state,
        userRecord: action.payload.userRecord,
        needsCitySelection: action.payload.needsCitySelection || false,
        needsProfileSetup: action.payload.needsProfileSetup || false,
      };
    default:
      return state;
  }
};

const AUTH_STORAGE_KEY = 'AUTH_USER_DATA';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const hasCompleteProfile = async userId => {
    try {
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

      return seekerProfile || companyProfile;
    } catch {
      return false;
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
        // Fetch user record from database
        const { data: userRecord, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') {
          throw userError;
        }

        // Determine user state
        const needsCitySelection = !userRecord?.city;
        const needsProfileSetup =
          userRecord?.city && !(await hasCompleteProfile(session.user.id));

        dispatch({
          type: 'AUTH_RESTORE',
          payload: {
            session,
            user: session.user,
            userRecord,
            needsCitySelection,
            needsProfileSetup,
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

      const { session, user, userRecord, isNewUser } = authData;

      if (!session || !user) {
        throw new Error('Invalid authentication data');
      }

      // Determine user state
      const needsCitySelection = !userRecord?.city;
      const needsProfileSetup =
        userRecord?.city && !isNewUser && !(await hasCompleteProfile(user.id));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          session,
          user,
          userRecord,
          needsCitySelection,
          needsProfileSetup,
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

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        'USER_MODE_PREFERENCE',
      ]);

      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Logout failed. Please try again.',
      });
    }
  };

  const updateUserRecord = async updates => {
    try {
      if (!state.userRecord?.id) {
        throw new Error('No user record to update');
      }

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.userRecord.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Check if user still needs city selection or profile setup
      const needsCitySelection = !updatedUser?.city;
      const needsProfileSetup =
        updatedUser?.city && !(await hasCompleteProfile(updatedUser.id));

      dispatch({
        type: 'UPDATE_USER_RECORD',
        payload: {
          userRecord: updatedUser,
          needsCitySelection,
          needsProfileSetup,
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
    error: state.error,
    login,
    logout,
    updateUserRecord,
    checkAuthStatus,
    clearError,
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
