import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seekerService, companyService } from '../services';

/**
 * Profile State Types
 */
const PROFILE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CURRENT_PROFILE: 'SET_CURRENT_PROFILE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

/**
 * Initial Profile State
 * Simplified to only manage current profile
 */
const initialState = {
  currentProfile: null,
  isLoading: false,
  error: null,
};

/**
 * Profile Reducer
 * Simplified for current profile only
 */
const profileReducer = (state, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case PROFILE_ACTIONS.SET_CURRENT_PROFILE:
      return { ...state, currentProfile: action.payload };

    case PROFILE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case PROFILE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

/**
 * Profile Context
 */
const ProfileContext = createContext();

/**
 * Profile Provider Component
 * Simplified to only manage current user profile
 */
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Memoize the loadCurrentProfile function
  const loadCurrentProfile = useCallback(async (userId, role) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      let profileData = null;

      if (role === 'seeker') {
        const { data, error } = await seekerService.getSeekerProfile(userId);
        if (error) {
          throw new Error(error);
        }
        profileData = data;
      } else if (role === 'company') {
        const { data, error } = await companyService.getCompanyProfile(userId);
        if (error) {
          throw new Error(error);
        }
        profileData = data;
      }

      dispatch({
        type: PROFILE_ACTIONS.SET_CURRENT_PROFILE,
        payload: profileData,
      });
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Memoize the updateCurrentProfile function
  const updateCurrentProfile = useCallback(async (updates) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      if (!state.currentProfile) {
        throw new Error('No current profile to update');
      }

      // Update the profile based on the current role
      const userId = state.currentProfile.user_id || state.currentProfile.id;
      const role = state.currentProfile.role || 'seeker';

      let updatedProfile = null;

      if (role === 'seeker') {
        const { data, error } = await seekerService.updateSeekerProfile(userId, updates);
        if (error) {
          throw new Error(error);
        }
        updatedProfile = data;
      } else if (role === 'company') {
        const { data, error } = await companyService.updateCompanyProfile(userId, updates);
        if (error) {
          throw new Error(error);
        }
        updatedProfile = data;
      }

      dispatch({
        type: PROFILE_ACTIONS.SET_CURRENT_PROFILE,
        payload: updatedProfile,
      });
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.currentProfile]);

  // Memoize the clearError function
  const clearError = useCallback(() => {
    dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      ...state,

      // Actions
      loadCurrentProfile,
      updateCurrentProfile,
      clearError,
    }),
    [
      state,
      loadCurrentProfile,
      updateCurrentProfile,
      clearError,
    ],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Custom hook to use profile context
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

/**
 * Granular hook for profile status only
 * Optimized for components that only need loading and error states
 */
export const useProfileStatus = () => {
  const { isLoading, error } = useProfile();
  return { isLoading, error };
};

export default ProfileContext;
