import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/navigation';

// Extended profile with additional metadata
export interface SavedProfile extends UserProfile {
  nickname: string; // Display name for profile switcher
  lastUsed: string; // ISO date string
  createdAt: string; // ISO date string
  isActive: boolean; // Currently selected profile
  avatar?: string; // Profile image URL or base64
  description?: string; // Optional profile description
}

// Profile state interface
interface ProfileState {
  profiles: SavedProfile[];
  activeProfile: SavedProfile | null;
  isLoading: boolean;
  error: string | null;
  isModalVisible: boolean;
}

// Profile actions
type ProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROFILES'; payload: SavedProfile[] }
  | { type: 'SET_ACTIVE_PROFILE'; payload: SavedProfile }
  | { type: 'ADD_PROFILE'; payload: SavedProfile }
  | { type: 'UPDATE_PROFILE'; payload: { id: string; updates: Partial<SavedProfile> } }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MODAL_VISIBLE'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// Profile context interface
interface ProfileContextType {
  state: ProfileState;
  profiles: SavedProfile[];
  activeProfile: SavedProfile | null;
  isLoading: boolean;
  error: string | null;
  isModalVisible: boolean;
  
  // Actions
  switchProfile: (profileId: string) => Promise<void>;
  addProfile: (profile: Omit<SavedProfile, 'id' | 'lastUsed' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateProfile: (profileId: string, updates: Partial<SavedProfile>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  duplicateProfile: (profileId: string, nickname: string) => Promise<void>;
  
  // Modal controls
  showProfileSwitcher: () => void;
  hideProfileSwitcher: () => void;
  
  // Utility
  clearError: () => void;
  getProfileInitials: (profile: SavedProfile) => string;
  getProfileDisplayName: (profile: SavedProfile) => string;
}

// Initial state
const initialState: ProfileState = {
  profiles: [],
  activeProfile: null,
  isLoading: true,
  error: null,
  isModalVisible: false,
};

// Profile reducer
const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
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
          lastUsed: p.id === action.payload.id ? new Date().toISOString() : p.lastUsed,
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
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
        activeProfile: state.activeProfile?.id === action.payload.id 
          ? { ...state.activeProfile, ...action.payload.updates }
          : state.activeProfile,
        error: null,
      };
    
    case 'DELETE_PROFILE':
      const remainingProfiles = state.profiles.filter(p => p.id !== action.payload);
      const wasActiveDeleted = state.activeProfile?.id === action.payload;
      
      return {
        ...state,
        profiles: remainingProfiles,
        activeProfile: wasActiveDeleted && remainingProfiles.length > 0 
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

// Storage keys
const PROFILES_STORAGE_KEY = 'SAVED_PROFILES';
const ACTIVE_PROFILE_STORAGE_KEY = 'ACTIVE_PROFILE_ID';

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Profile provider props
interface ProfileProviderProps {
  children: ReactNode;
}

// Profile provider component
export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Load saved profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Load profiles from storage
  const loadProfiles = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [savedProfiles, activeProfileId] = await Promise.all([
        AsyncStorage.getItem(PROFILES_STORAGE_KEY),
        AsyncStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY),
      ]);

      const profiles: SavedProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [];
      
      if (profiles.length === 0) {
        // Create default profile if none exist
        const defaultProfile = await createDefaultProfile();
        profiles.push(defaultProfile);
      }

      dispatch({ type: 'SET_PROFILES', payload: profiles });

      // Set active profile
      const foundProfile = profiles.find(p => p.id === activeProfileId);
      const activeProfile = foundProfile || (profiles.length > 0 ? profiles[0] : null);
      if (activeProfile) {
        dispatch({ type: 'SET_ACTIVE_PROFILE', payload: activeProfile });
      }

    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load profiles' });
    }
  };

  // Create default profile
  const createDefaultProfile = async (): Promise<SavedProfile> => {
    const now = new Date().toISOString();
    return {
      id: 'default-' + Date.now(),
      name: 'Demo User',
      email: 'demo@jobconnect.app',
      mode: 'seeker',
      nickname: 'Personal',
      lastUsed: now,
      createdAt: now,
      isActive: true,
      description: 'Personal job search profile',
    };
  };

  // Save profiles to storage
  const saveProfiles = async (profiles: SavedProfile[], activeProfileId?: string): Promise<void> => {
    try {
      await Promise.all([
        AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles)),
        activeProfileId ? AsyncStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, activeProfileId) : Promise.resolve(),
      ]);
    } catch (error) {
      throw new Error('Failed to save profiles');
    }
  };

  // Switch to a specific profile
  const switchProfile = async (profileId: string): Promise<void> => {
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

  // Add new profile
  const addProfile = async (profileData: Omit<SavedProfile, 'id' | 'lastUsed' | 'createdAt' | 'isActive'>): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const newProfile: SavedProfile = {
        ...profileData,
        id: 'profile-' + Date.now(),
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

  // Update existing profile
  const updateProfile = async (profileId: string, updates: Partial<SavedProfile>): Promise<void> => {
    try {
      dispatch({ type: 'UPDATE_PROFILE', payload: { id: profileId, updates } });
      await saveProfiles(state.profiles);
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
    }
  };

  // Delete profile
  const deleteProfile = async (profileId: string): Promise<void> => {
    try {
      if (state.profiles.length <= 1) {
        throw new Error('Cannot delete the last profile');
      }

      dispatch({ type: 'DELETE_PROFILE', payload: profileId });
      const remainingProfiles = state.profiles.filter(p => p.id !== profileId);
      await saveProfiles(remainingProfiles, remainingProfiles[0]?.id);
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to delete profile' });
    }
  };

  // Duplicate existing profile
  const duplicateProfile = async (profileId: string, nickname: string): Promise<void> => {
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

  // Modal controls
  const showProfileSwitcher = (): void => {
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: true });
  };

  const hideProfileSwitcher = (): void => {
    dispatch({ type: 'SET_MODAL_VISIBLE', payload: false });
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get profile initials
  const getProfileInitials = (profile: SavedProfile): string => {
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

  // Get profile display name
  const getProfileDisplayName = (profile: SavedProfile): string => {
    return profile.nickname || profile.name;
  };

  // Context value
  const contextValue: ProfileContextType = {
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

// Custom hook to use profile context
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }

  return context;
};

// Export profile context for advanced usage
export { ProfileContext }; 