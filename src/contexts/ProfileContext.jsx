import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearErrorHelper } from '../utils/clearError.js';

const initialState = {
  profiles: [],
  activeProfile: null,
  isLoading: true,
  error: null,
  isModalVisible: false,
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_PROFILES':
      return {
        ...state,
        profiles: action.payload,
        isLoading: false,
        error: null,
      };

    case 'SET_ACTIVE_PROFILE':
      return {
        ...state,
        activeProfile: action.payload,
        profiles: state.profiles.map(p => ({
          ...p,
          isActive: p.id === action.payload.id,
          lastUsed:
            p.id === action.payload.id ? new Date().toISOString() : p.lastUsed,
        })),
        error: null,
      };

    case 'ADD_PROFILE':
      return {
        ...state,
        profiles: [...state.profiles, action.payload],
        error: null,
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p,
        ),
        activeProfile:
          state.activeProfile?.id === action.payload.id
            ? { ...state.activeProfile, ...action.payload.updates }
            : state.activeProfile,
        error: null,
      };

    case 'DELETE_PROFILE':
      const remainingProfiles = state.profiles.filter(
        p => p.id !== action.payload,
      );
      const wasActiveDeleted = state.activeProfile?.id === action.payload;

      return {
        ...state,
        profiles: remainingProfiles,
        activeProfile:
          wasActiveDeleted && remainingProfiles.length > 0
            ? remainingProfiles[0]
            : wasActiveDeleted
            ? null
            : state.activeProfile,
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'SET_MODAL_VISIBLE':
      return { ...state, isModalVisible: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

const PROFILES_STORAGE_KEY = 'SAVED_PROFILES';
const ACTIVE_PROFILE_STORAGE_KEY = 'ACTIVE_PROFILE_ID';

const ProfileContext = createContext(undefined);

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [savedProfiles, activeProfileId] = await Promise.all([
        AsyncStorage.getItem(PROFILES_STORAGE_KEY),
        AsyncStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY),
      ]);

      const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];

      if (profiles.length === 0) {
        const defaultProfiles = await createDefaultProfiles();
        profiles.push(...defaultProfiles);
      }

      dispatch({ type: 'SET_PROFILES', payload: profiles });

      const foundProfile = profiles.find(p => p.id === activeProfileId);
      const activeProfile =
        foundProfile || (profiles.length > 0 ? profiles[0] : null);
      if (activeProfile) {
        dispatch({ type: 'SET_ACTIVE_PROFILE', payload: activeProfile });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load profiles' });
    }
  };

  const createDefaultProfiles = async () => {
    const now = new Date().toISOString();
    const seekerProfile = {
      id: `seeker-${Date.now()}`,
      name: 'Demo User',
      email: 'demo@jobconnect.app',
      mode: 'seeker',
      nickname: 'Personal',
      lastUsed: now,
      createdAt: now,
      isActive: true,
      description: 'Personal job search profile',
    };

    const posterProfile = {
      id: `poster-${Date.now() + 1}`,
      name: 'Demo Recruiter',
      email: 'recruiter@jobconnect.app',
      mode: 'poster',
      nickname: 'Work',
      lastUsed: now,
      createdAt: now,
      isActive: false,
      description: 'Work profile for posting jobs',
    };

    return [seekerProfile, posterProfile];
  };

  const saveProfiles = async (profiles, activeProfileId) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles)),
        activeProfileId
          ? AsyncStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, activeProfileId)
          : Promise.resolve(),
      ]);
    } catch (error) {
      throw new Error('Failed to save profiles');
    }
  };

  const switchProfile = async profileId => {
    try {
      const profile = state.profiles.find(p => p.id === profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }

      dispatch({ type: 'SET_ACTIVE_PROFILE', payload: profile });
      await saveProfiles(state.profiles, profileId);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to switch profile' });
    }
  };

  const addProfile = async profileData => {
    try {
      const now = new Date().toISOString();
      const newProfile = {
        ...profileData,
        id: `profile-${Date.now()}`,
        lastUsed: now,
        createdAt: now,
        isActive: false,
      };

      const updatedProfiles = [...state.profiles, newProfile];
      dispatch({ type: 'ADD_PROFILE', payload: newProfile });
      await saveProfiles(updatedProfiles);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add profile' });
    }
  };

  const updateProfile = async (profileId, updates) => {
    try {
      // Create the updated profiles array
      const updatedProfiles = state.profiles.map(p =>
        p.id === profileId ? { ...p, ...updates } : p,
      );
      dispatch({ type: 'UPDATE_PROFILE', payload: { id: profileId, updates } });
      await saveProfiles(updatedProfiles);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
    }
  };

  const deleteProfile = async profileId => {
    try {
      if (state.profiles.length <= 1) {
        throw new Error('Cannot delete the last profile');
      }

      dispatch({ type: 'DELETE_PROFILE', payload: profileId });
      const remainingProfiles = state.profiles.filter(p => p.id !== profileId);
      await saveProfiles(remainingProfiles, remainingProfiles[0]?.id);
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.message || 'Failed to delete profile',
      });
    }
  };

  const duplicateProfile = async (profileId, nickname) => {
    try {
      const sourceProfile = state.profiles.find(p => p.id === profileId);
      if (!sourceProfile) {
        throw new Error('Source profile not found');
      }

      await addProfile({
        ...sourceProfile,
        nickname,
        description: `Copy of ${sourceProfile.nickname}`,
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to duplicate profile' });
    }
  };

  const showProfileSwitcher = () => {
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: true });
  };

  const hideProfileSwitcher = () => {
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: false });
  };

  const clearError = () => {
    clearErrorHelper(dispatch, 'CLEAR_ERROR');
  };

  const getProfileInitials = profile => {
    if (profile.nickname) {
      return profile.nickname
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return profile.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProfileDisplayName = profile => {
    return profile.nickname || profile.name;
  };

  const contextValue = {
    state,
    profiles: state.profiles,
    activeProfile: state.activeProfile,
    isLoading: state.isLoading,
    error: state.error,
    isModalVisible: state.isModalVisible,

    switchProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    duplicateProfile,

    showProfileSwitcher,
    hideProfileSwitcher,

    clearError,
    getProfileInitials,
    getProfileDisplayName,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
};

export { ProfileContext };
