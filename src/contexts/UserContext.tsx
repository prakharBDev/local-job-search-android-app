import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import type { UserMode } from '../types/navigation';

// User state interface
interface UserState {
  currentMode: UserMode;
  isLoading: boolean;
  error: string | null;
}

// User actions
type UserAction =
  | { type: 'SET_MODE_LOADING' }
  | { type: 'SET_MODE_SUCCESS'; payload: UserMode }
  | { type: 'SET_MODE_ERROR'; payload: string }
  | { type: 'RESTORE_MODE'; payload: UserMode };

// User context interface
interface UserContextType {
  state: UserState;
  currentMode: UserMode;
  isLoading: boolean;
  error: string | null;
  switchMode: (mode: UserMode) => Promise<void>;
  toggleMode: () => Promise<void>;
  clearError: () => void;
  isSeekerMode: boolean;
  isPosterMode: boolean;
}

// Initial state
const initialState: UserState = {
  currentMode: 'seeker', // Default to seeker mode
  isLoading: false,
  error: null,
};

// User reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
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

// Storage key
const USER_MODE_STORAGE_KEY = 'USER_MODE_PREFERENCE';

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// User provider props
interface UserProviderProps {
  children: ReactNode;
}

// User provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load saved mode on mount
  useEffect(() => {
    const loadSavedMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(USER_MODE_STORAGE_KEY);
        if (savedMode && (savedMode === 'seeker' || savedMode === 'poster')) {
          dispatch({ type: 'RESTORE_MODE', payload: savedMode as UserMode });
        }
      } catch (error) {
        console.error('Failed to load user mode:', error);
        // Continue with default mode
      }
    };

    loadSavedMode();
  }, []);

  // Switch to specific mode
  const switchMode = async (mode: UserMode): Promise<void> => {
    try {
      dispatch({ type: 'SET_MODE_LOADING' });

      // Save mode preference
      await AsyncStorage.setItem(USER_MODE_STORAGE_KEY, mode);

      // Small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 200));

      dispatch({ type: 'SET_MODE_SUCCESS', payload: mode });
    } catch (error) {
      console.error('Failed to switch mode:', error);
      dispatch({
        type: 'SET_MODE_ERROR',
        payload: 'Failed to switch mode. Please try again.',
      });
    }
  };

  // Toggle between modes
  const toggleMode = async (): Promise<void> => {
    const newMode: UserMode =
      state.currentMode === 'seeker' ? 'poster' : 'seeker';
    await switchMode(newMode);
  };

  // Clear error function
  const clearError = (): void => {
    if (state.error) {
      dispatch({ type: 'RESTORE_MODE', payload: state.currentMode });
    }
  };

  // Context value
  const contextValue: UserContextType = {
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

// Custom hook to use user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

// Export user context for advanced usage
export { UserContext };
