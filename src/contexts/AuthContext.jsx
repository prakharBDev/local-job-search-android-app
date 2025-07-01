import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
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
        user: action.payload,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      };
    case 'AUTH_RESTORE':
      return {
        ...state,
        isAuthenticated: action.payload !== null,
        isLoading: false,
        user: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

const AUTH_STORAGE_KEY = 'AUTH_USER_DATA';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'AUTH_RESTORE', payload: user });
      } else {
        dispatch({ type: 'AUTH_RESTORE', payload: null });
      }
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Failed to check authentication status',
      });
    }
  };

  const login = async user => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Login failed. Please try again.',
      });
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      await AsyncStorage.multiRemove([
        AUTH_STORAGE_KEY,
        'USER_MODE_PREFERENCE',
      ]);

      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Logout failed. Please try again.',
      });
    }
  };

  const clearError = () => {
    if (state.error) {
      dispatch({ type: 'AUTH_RESTORE', payload: state.user });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const contextValue = {
    state,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: state.user,
    error: state.error,
    login,
    logout,
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
