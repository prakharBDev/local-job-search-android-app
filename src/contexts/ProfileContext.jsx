import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seekerService, companyService } from '../services';

/**
 * Profile State Types
 */
const PROFILE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PROFILES: 'SET_PROFILES',
  SET_ACTIVE_PROFILE: 'SET_ACTIVE_PROFILE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_MODAL_VISIBLE: 'SET_MODAL_VISIBLE',
  SET_CURRENT_ROLE: 'SET_CURRENT_ROLE',
  SET_CURRENT_PROFILE: 'SET_CURRENT_PROFILE',
};

/**
 * Initial Profile State
 * Preserving ALL original state properties
 */
const initialState = {
  profiles: [],
  activeProfile: null,
  isLoading: false,
  error: null,
  isModalVisible: false,
  currentRole: null,
  currentProfile: null,
};

/**
 * Profile Reducer
 * Optimized for predictable state updates
 */
const profileReducer = (state, action) => {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case PROFILE_ACTIONS.SET_PROFILES:
      return { ...state, profiles: action.payload };
    
    case PROFILE_ACTIONS.SET_ACTIVE_PROFILE:
      return { ...state, activeProfile: action.payload };
    
    case PROFILE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case PROFILE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case PROFILE_ACTIONS.SET_MODAL_VISIBLE:
      return { ...state, isModalVisible: action.payload };
    
    case PROFILE_ACTIONS.SET_CURRENT_ROLE:
      return { ...state, currentRole: action.payload };
    
    case PROFILE_ACTIONS.SET_CURRENT_PROFILE:
      return { ...state, currentProfile: action.payload };
    
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
 * Optimized for performance with proper memoization and reduced re-renders
 * FULLY BACKWARD COMPATIBLE with original ProfileContext.jsx API
 */
export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Memoize the loadProfiles function
  const loadProfiles = useCallback(async () => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      const savedProfiles = await AsyncStorage.getItem('user_profiles');
      const savedActiveProfileId = await AsyncStorage.getItem('active_profile');

      if (savedProfiles) {
        const profiles = JSON.parse(savedProfiles);
        dispatch({ type: PROFILE_ACTIONS.SET_PROFILES, payload: profiles });

        if (savedActiveProfileId) {
          const activeProfile = profiles.find(p => p.id === savedActiveProfileId);
          if (activeProfile) {
            dispatch({ type: PROFILE_ACTIONS.SET_ACTIVE_PROFILE, payload: activeProfile });
          }
        }
      }

      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Memoize the createDefaultProfiles function
  const createDefaultProfiles = useCallback(async (userId) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      const defaultProfiles = [
        {
          id: 'seeker',
          name: 'Job Seeker',
          type: 'seeker',
          userId,
          isDefault: true,
        },
        {
          id: 'company',
          name: 'Company',
          type: 'company',
          userId,
          isDefault: false,
        },
      ];

      await AsyncStorage.setItem('user_profiles', JSON.stringify(defaultProfiles));
      await AsyncStorage.setItem('active_profile', 'seeker');

      dispatch({ type: PROFILE_ACTIONS.SET_PROFILES, payload: defaultProfiles });
      dispatch({ type: PROFILE_ACTIONS.SET_ACTIVE_PROFILE, payload: defaultProfiles[0] });

      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Memoize the saveProfiles function
  const saveProfiles = useCallback(async (profiles) => {
    try {
      await AsyncStorage.setItem('user_profiles', JSON.stringify(profiles));
      dispatch({ type: PROFILE_ACTIONS.SET_PROFILES, payload: profiles });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Memoize the updateProfile function
  const updateProfile = useCallback(async (profileId, updates) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      const updatedProfiles = state.profiles.map(profile =>
        profile.id === profileId ? { ...profile, ...updates } : profile
      );

      await saveProfiles(updatedProfiles);

      // Update active profile if it's the one being updated
      if (state.activeProfile?.id === profileId) {
        const updatedActiveProfile = updatedProfiles.find(p => p.id === profileId);
        dispatch({ type: PROFILE_ACTIONS.SET_ACTIVE_PROFILE, payload: updatedActiveProfile });
      }

      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.profiles, state.activeProfile, saveProfiles]);

  // Memoize the duplicateProfile function
  const duplicateProfile = useCallback(async (profileId) => {
    try {
      const profileToDuplicate = state.profiles.find(p => p.id === profileId);
      if (!profileToDuplicate) {
        throw new Error('Profile not found');
      }

      const newProfile = {
        ...profileToDuplicate,
        id: `${profileId}_copy_${Date.now()}`,
        name: `${profileToDuplicate.name} (Copy)`,
        isDefault: false,
      };

      const updatedProfiles = [...state.profiles, newProfile];
      await saveProfiles(updatedProfiles);
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.profiles, saveProfiles]);

  // Memoize the showProfileSwitcher function
  const showProfileSwitcher = useCallback(() => {
    dispatch({ type: PROFILE_ACTIONS.SET_MODAL_VISIBLE, payload: true });
  }, []);

  // Memoize the hideProfileSwitcher function
  const hideProfileSwitcher = useCallback(() => {
    dispatch({ type: PROFILE_ACTIONS.SET_MODAL_VISIBLE, payload: false });
  }, []);

  // Memoize the clearError function
  const clearError = useCallback(() => {
    dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });
  }, []);

  // Memoize the switchRole function
  const switchRole = useCallback(async (role) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      const profile = state.profiles.find(p => p.type === role);
      if (profile) {
        await AsyncStorage.setItem('active_profile', profile.id);
        dispatch({ type: PROFILE_ACTIONS.SET_ACTIVE_PROFILE, payload: profile });
        dispatch({ type: PROFILE_ACTIONS.SET_CURRENT_ROLE, payload: role });
      }

      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.profiles]);

  // Memoize the loadCurrentProfile function
  const loadCurrentProfile = useCallback(async (userId, role) => {
    try {
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: PROFILE_ACTIONS.CLEAR_ERROR });

      let profileData = null;

      if (role === 'seeker') {
        const { data, error } = await seekerService.getSeekerProfile(userId);
        if (error) throw new Error(error);
        profileData = data;
      } else if (role === 'company') {
        const { data, error } = await companyService.getCompanyProfile(userId);
        if (error) throw new Error(error);
        profileData = data;
      }

      dispatch({ type: PROFILE_ACTIONS.SET_CURRENT_PROFILE, payload: profileData });
      dispatch({ type: PROFILE_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: PROFILE_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    ...state,
    
    // Actions
    loadProfiles,
    createDefaultProfiles,
    saveProfiles,
    updateProfile,
    duplicateProfile,
    showProfileSwitcher,
    hideProfileSwitcher,
    clearError,
    switchRole,
    loadCurrentProfile,
  }), [
    state,
    loadProfiles,
    createDefaultProfiles,
    saveProfiles,
    updateProfile,
    duplicateProfile,
    showProfileSwitcher,
    hideProfileSwitcher,
    clearError,
    switchRole,
    loadCurrentProfile,
  ]);

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

/**
 * Custom hook to use profile context
 * FULLY BACKWARD COMPATIBLE with original useProfile hook
 */
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

/**
 * Granular hook for current role only
 * Optimized for components that only need current role information
 */
export const useCurrentRole = () => {
  const { currentRole } = useProfile();
  return { currentRole };
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