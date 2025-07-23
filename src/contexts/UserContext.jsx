import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { clearErrorHelper } from '../utils/clearError.js';
import { userService } from '../services';
import { useAuth } from './AuthContext';

const initialState = {
  currentMode: 'seeker',
  isLoading: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MODE_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'SET_MODE_SUCCESS':
      return {
        ...state,
        currentMode: action.payload,
        isLoading: false,
        error: null,
      };
    case 'SET_MODE_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'RESTORE_MODE':
      return {
        ...state,
        currentMode: action.payload,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const USER_MODE_STORAGE_KEY = 'USER_MODE_PREFERENCE';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { user, userRecord, checkAuthStatus } = useAuth();

  useEffect(() => {
    const loadSavedMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(USER_MODE_STORAGE_KEY);
        if (savedMode && (savedMode === 'seeker' || savedMode === 'poster')) {
          dispatch({ type: 'RESTORE_MODE', payload: savedMode });
        }
      } catch (error) {
        // Continue with default mode
      }
    };

    loadSavedMode();
  }, []);

  useEffect(() => {
    // Update user mode based on auth context
    if (userRecord) {
      // This would be determined by checking profile tables
      // For now, we'll use the existing logic
    }
  }, [userRecord]);

  const switchMode = async mode => {
    if (!user) {
      dispatch({
        type: 'SET_MODE_ERROR',
        payload: 'User not authenticated.',
      });
      return;
    }

    dispatch({ type: 'SET_MODE_LOADING' });
    try {
      const updates = {
        is_seeker: mode === 'seeker',
      };

      const { error } = await userService.updateUser(user.id, updates);

      if (error) {
        throw error;
      }

      await AsyncStorage.setItem(USER_MODE_STORAGE_KEY, mode);
      
      // Refresh user data to get the latest profile status
      await checkAuthStatus(); 

      dispatch({ type: 'SET_MODE_SUCCESS', payload: mode });
    } catch (error) {
      console.error("Failed to switch mode:", error);
      dispatch({
        type: 'SET_MODE_ERROR',
        payload: 'Failed to switch mode. Please try again.',
      });
    }
  };

  const toggleMode = async () => {
    const newMode = state.currentMode === 'seeker' ? 'poster' : 'seeker';
    await switchMode(newMode);
  };

  const clearError = () => {
    if (state.error) {
      clearErrorHelper(dispatch, 'RESTORE_MODE', state.currentMode);
    }
  };

  const contextValue = {
    state,
    currentMode: state.currentMode,
    isLoading: state.isLoading,
    error: state.error,
    switchMode,
    toggleMode,
    clearError,
    isSeekerMode: state.currentMode === 'seeker',
    isPosterMode: state.currentMode === 'poster',
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export { UserContext };
