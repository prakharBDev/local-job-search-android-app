import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from '../types/navigation';

// Auth state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}

// Auth actions
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: UserProfile }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_RESTORE'; payload: UserProfile | null };

// Auth context interface
interface AuthContextType {
  state: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
  login: (user: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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

// Storage keys
const AUTH_STORAGE_KEY = 'AUTH_USER_DATA';

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check auth status on app start
  const checkAuthStatus = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (userData) {
        const user: UserProfile = JSON.parse(userData);
        dispatch({ type: 'AUTH_RESTORE', payload: user });
      } else {
        dispatch({ type: 'AUTH_RESTORE', payload: null });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'AUTH_ERROR', payload: 'Failed to check authentication status' });
    }
  };

  // Login function
  const login = async (user: UserProfile): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      // Store user data
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: 'AUTH_ERROR', payload: 'Login failed. Please try again.' });
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });

      // Clear stored data
      await AsyncStorage.multiRemove([AUTH_STORAGE_KEY, 'USER_MODE_PREFERENCE']);

      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch({ type: 'AUTH_ERROR', payload: 'Logout failed. Please try again.' });
    }
  };

  // Clear error function
  const clearError = (): void => {
    if (state.error) {
      dispatch({ type: 'AUTH_RESTORE', payload: state.user });
    }
  };

  // Auto-check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Context value
  const contextValue: AuthContextType = {
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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Export auth context for advanced usage
export { AuthContext };

