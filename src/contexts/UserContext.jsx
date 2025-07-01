import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';

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

  const switchMode = async mode => {
    try {
      dispatch({ type: 'SET_MODE_LOADING' });

      await AsyncStorage.setItem(USER_MODE_STORAGE_KEY, mode);

      await new Promise(resolve => setTimeout(resolve, 200));

      dispatch({ type: 'SET_MODE_SUCCESS', payload: mode });
    } catch (error) {
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
      dispatch({ type: 'RESTORE_MODE', payload: state.currentMode });
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
