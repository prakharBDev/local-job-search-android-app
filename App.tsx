// App.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';

// Import navigation types
import type {
  AuthStackParamList,
  RootStackParamList,
} from './src/types/navigation';

// Import screens
import MainNavigator from './src/navigation/MainNavigator';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';

// Import providers
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';

// Import theme
import { theme } from './src/theme';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Auth Stack Navigator
const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreenContainer} />
      <AuthStack.Screen name="Login" component={LoginScreenContainer} />
    </AuthStack.Navigator>
  );
};

// Splash Screen Container with navigation
const SplashScreenContainer: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  const handleSplashFinish = () => {
    // Navigate to login screen after splash finishes if not authenticated
    if (!isLoading && !isAuthenticated && navigation) {
      navigation.navigate('Login');
    }
  };

  return <SplashScreen onFinish={handleSplashFinish} />;
};

// Login Screen Container with navigation
const LoginScreenContainer: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    // Mock login - in real app, this would be Google Auth
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      mode: 'seeker' as const,
      education: {
        tenth: 85,
        twelfth: 88,
        graduation: 82,
      },
    };

    await login(mockUser);
  };

  return <LoginScreen onLogin={handleLogin} />;
};

// Main App Navigator
const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoading || !isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} options={{}} />
      ) : (
        <RootStack.Screen name="Main" component={MainNavigator} options={{}} />
      )}
    </RootStack.Navigator>
  );
};

// Deep linking configuration
const linking = {
  prefixes: ['jobportal://', 'https://jobportal.app'],
  config: {
    screens: {
      Auth: {
        path: '/auth',
        screens: {
          Login: 'login',
          Splash: 'splash',
        },
      },
      Main: {
        path: '/app',
        screens: {
          Dashboard: 'dashboard',
          Profile: 'profile',
          AppliedJobs: 'applied-jobs',
          MyJobs: 'my-jobs',
        },
      },
      JobDetails: {
        path: '/job/:jobId',
        parse: {
          jobId: (jobId: string) => jobId,
        },
      },
      CreateJob: 'create-job',
      JobApplications: {
        path: '/job/:jobId/applications',
        parse: {
          jobId: (jobId: string) => jobId,
        },
      },
      ApplicationDetails: {
        path: '/application/:applicationId',
        parse: {
          applicationId: (applicationId: string) => applicationId,
        },
      },
    },
  },
};

// Navigation state persistence
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

// Simple loading component that doesn't use any context
const AppLoadingScreen: React.FC = () => {
  return <SplashScreen onFinish={() => {}} />;
};

// Inner App component that uses providers
const InnerApp: React.FC<{
  initialState: any;
  onStateChange: (state: any) => void;
}> = ({ initialState, onStateChange }) => {
  return (
    <NavigationContainer
      linking={linking}
      initialState={initialState}
      onStateChange={onStateChange}
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary.emerald,
          background: theme.colors.background.primary,
          card: theme.colors.background.secondary,
          text: theme.colors.text.primary,
          border: theme.colors.border.primary,
          notification: theme.colors.status.error,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: 'normal',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: 'bold',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '800',
          },
        },
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
};

// Main App component
const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState<any>(undefined);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = null; // await Linking.getInitialURL() in real app

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const onStateChange = (state: any) => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.primary}
        translucent={false}
      />
      <AuthProvider>
        <UserProvider>
          {!isReady ? (
            <AppLoadingScreen />
          ) : (
            <InnerApp
              initialState={initialState}
              onStateChange={onStateChange}
            />
          )}
        </UserProvider>
      </AuthProvider>
    </>
  );
};

export default App;
