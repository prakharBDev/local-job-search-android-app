// App.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';

// Import screens
import MainNavigator from './src/navigation/MainNavigator';
import IndexScreen from './src/landingpage/screens/IndexScreen';
import SplashScreen from './src/splash/screens/SplashScreen';
import SettingsScreen from './src/settings/screens/SettingsScreen';
import AboutScreen from './src/about/screens/AboutScreen';
import CitySelectionScreen from './src/onboarding/screens/CitySelectionScreen';
import OnboardingScreen from './src/onboarding/screens/OnboardingScreen';
import OnboardingSuccessScreen from './src/onboarding/screens/OnboardingSuccessScreen';

import SeekerProfileSetupScreen from './src/profile/screens/SeekerProfileSetupScreen';
import CompanyProfileSetupScreen from './src/profile/screens/CompanyProfileSetupScreen';
import SkillsSelectionScreen from './src/profile/screens/SkillsSelectionScreen';
import CategorySelectionScreen from './src/profile/screens/CategorySelectionScreen';

// Import providers and components
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { ProfileProvider } from './src/contexts/ProfileContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import ErrorBoundary from './src/shared/components/ErrorBoundary';

// Create navigators
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreenContainer} />
      <AuthStack.Screen name="Login" component={IndexScreenContainer} />
    </AuthStack.Navigator>
  );
};

// Splash Screen Container with navigation
const SplashScreenContainer = ({ navigation }) => {
  const { isAuthenticated, isLoading } = useAuth();

  const handleSplashFinish = () => {
    // Navigate to login screen after splash finishes if not authenticated
    if (!isLoading && !isAuthenticated && navigation) {
      navigation.navigate('Login');
    }
  };

  return <SplashScreen onFinish={handleSplashFinish} />;
};

// Index Screen Container (beautiful landing page with built-in auth)
const IndexScreenContainer = () => {
  // IndexScreen has its own authentication logic built-in
  return <IndexScreen />;
};

// Main App Navigator
const AppNavigator = () => {
  const {
    isAuthenticated,
    isLoading,
    needsCitySelection,
    needsRoleSelection,
    needsProfileSetup,
    userRecord,
  } = useAuth();
  const { theme } = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isLoading || !isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} options={{}} />
      ) : needsCitySelection ? (
        <RootStack.Screen
          name="CitySelection"
          component={CitySelectionScreen}
          options={{}}
        />
      ) : needsRoleSelection || needsProfileSetup ? (
        <>
          <RootStack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{}}
          />
          {/* Profile Setup Screens - Accessible from Onboarding */}
          <RootStack.Screen
            name="SeekerProfileSetup"
            component={SeekerProfileSetupScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="CompanyProfileSetup"
            component={CompanyProfileSetupScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="SkillsSelection"
            component={SkillsSelectionScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="CategorySelection"
            component={CategorySelectionScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="OnboardingSuccess"
            component={OnboardingSuccessScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <RootStack.Screen
            name="Main"
            component={MainNavigator}
            options={{}}
          />
          <RootStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.background.primary,
              },
              headerTintColor: theme.colors.text.primary,
            }}
          />
          <RootStack.Screen
            name="About"
            component={AboutScreen}
            options={{
              title: 'About',
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.background.primary,
              },
              headerTintColor: theme.colors.text.primary,
            }}
          />
        </>
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
      Onboarding: 'onboarding',
      OnboardingSuccess: 'onboarding-success',
      Main: {
        path: '/app',
        screens: {
          Dashboard: 'dashboard',
          Profile: 'profile',
          AppliedJobs: 'applied-jobs',
          MyJobs: 'my-jobs',
        },
      },

      Settings: 'settings',
      About: 'about',
      // Profile Setup Screens
      SeekerProfileSetup: 'seeker-profile-setup',
      CompanyProfileSetup: 'company-profile-setup',
      SkillsSelection: 'skills-selection',
      CategorySelection: 'category-selection',
      // TODO: Add additional routes when screens are created
    },
  },
};

// Navigation state persistence
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1';

// Simple loading component that doesn't use any context
const AppLoadingScreen = () => {
  return <SplashScreen onFinish={() => {}} />;
};

// Inner App component that uses providers
const InnerApp = ({ initialState, onStateChange }) => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      linking={linking}
      initialState={initialState}
      onStateChange={onStateChange}
      onUnhandledAction={action => {
        console.warn('Unhandled navigation action:', action);
      }}
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary.main,
          background: theme.colors.background.primary,
          card: theme.colors.surface.card,
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

// Themed App component that uses theme context
const ThemedApp = ({ initialState, onStateChange }) => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background.primary}
        translucent={false}
      />
      <InnerApp initialState={initialState} onStateChange={onStateChange} />
    </>
  );
};

// Main App component
const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState(undefined);

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

  const onStateChange = state => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  };

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <UserProvider>
            <ProfileProvider>
              {!isReady ? (
                <AppLoadingScreen />
              ) : (
                <ThemedApp
                  initialState={initialState}
                  onStateChange={onStateChange}
                />
              )}
            </ProfileProvider>
          </UserProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
