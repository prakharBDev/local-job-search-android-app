// App.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, SafeAreaView, View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

// Import screens
import MainNavigator from './src/navigation/MainNavigator';
import IndexScreen from './src/landingpage/screens/IndexScreen';
import SplashScreen from './src/splash/screens/SplashScreen';

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

// Auth Stack Navigator - Splash removed, handled at app level
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={IndexScreenContainer} />
    </AuthStack.Navigator>
  );
};

// Splash screen is now handled at the app level

// Reusable Loading Screen Component
const LoadingScreen = ({ message, subMessage, showCancel = false, onCancel }) => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 40,
      }}>
        <ActivityIndicator size="large" color={theme?.colors?.primary?.main || '#6174f9'} />
        <Text style={{
          marginTop: 24,
          fontSize: 18,
          fontWeight: '600',
          color: theme?.colors?.text?.primary || '#1E293B',
          textAlign: 'center'
        }}>
          {message || 'Loading...'}
        </Text>
        {subMessage && (
          <Text style={{
            marginTop: 8,
            fontSize: 14,
            color: theme?.colors?.text?.secondary || '#64748B',
            textAlign: 'center',
            lineHeight: 20,
          }}>
            {subMessage}
          </Text>
        )}
        {showCancel && onCancel && (
          <TouchableOpacity
            style={{
              marginTop: 32,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme?.colors?.border?.primary || '#E2E8F0',
            }}
            onPress={onCancel}
          >
            <Text style={{
              fontSize: 14,
              color: theme?.colors?.text?.secondary || '#64748B',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

// Specific loading screens for different contexts
const OnboardingLoadingScreen = () => (
  <LoadingScreen 
    message="Setting up your experience..."
    subMessage="We're checking your profile and preferences to get you started."
  />
);

const AuthLoadingScreen = () => (
  <LoadingScreen 
    message="Verifying your account..."
    subMessage="Please wait while we confirm your authentication status."
  />
);

const StateRecoveryScreen = ({ onRetry }) => (
  <LoadingScreen 
    message="Recovering your session..."
    subMessage="We're fixing an inconsistent state. This should only take a moment."
    showCancel={true}
    onCancel={onRetry}
  />
);

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
    checkAuthStatus,
    logout,
  } = useAuth();
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);


  // Add additional loading check for onboarding state
  const isOnboardingStateLoading = isAuthenticated && !userRecord;
  
  // Check if we're still determining onboarding status
  // This should be true when any onboarding state is undefined, regardless of userRecord
  const isDeterminingOnboarding = isAuthenticated && 
    (needsCitySelection === undefined || needsRoleSelection === undefined || needsProfileSetup === undefined);
    
  // Add extra safety check for users with pending onboarding
  const hasOnboardingStates = needsCitySelection !== undefined && needsRoleSelection !== undefined && needsProfileSetup !== undefined;

  // State recovery logic
  const handleStateRecovery = async () => {
    if (recoveryAttempts >= 3) {
      console.warn('🚨 [AppNavigator] Max recovery attempts reached, logging out');
      Alert.alert(
        'Session Recovery Failed',
        'We encountered an issue with your session. Please log in again.',
        [
          {
            text: 'OK',
            onPress: () => logout(),
          },
        ]
      );
      return;
    }

    setIsRecovering(true);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      console.log(`🔄 [AppNavigator] Attempting state recovery (attempt ${recoveryAttempts + 1})`);
      await checkAuthStatus();
      
      // Wait a moment for state to settle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('❌ [AppNavigator] State recovery failed:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  // Detect invalid states that need recovery
  const needsStateRecovery = isAuthenticated && !isLoading && (
    (isOnboardingStateLoading && !isRecovering) ||
    (!hasOnboardingStates && !isRecovering && recoveryAttempts < 3)
  );

  // Trigger automatic recovery for certain conditions
  useEffect(() => {
    if (needsStateRecovery && !isRecovering && recoveryAttempts === 0) {
      console.log('🚨 [AppNavigator] Invalid state detected, triggering automatic recovery');
      handleStateRecovery();
    }
  }, [needsStateRecovery, isRecovering, recoveryAttempts]);

  // Determine the appropriate loading screen
  const getLoadingScreen = () => {
    if (isLoading) {
      return <RootStack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{}} />;
    }
    if (isOnboardingStateLoading || isDeterminingOnboarding || !hasOnboardingStates) {
      return <RootStack.Screen name="OnboardingLoading" component={OnboardingLoadingScreen} options={{}} />;
    }
    return null;
  };

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} options={{}} />
      ) : getLoadingScreen() ? (
        getLoadingScreen()
      ) : needsCitySelection ? (
        <RootStack.Screen
          name="CitySelection"
          component={CitySelectionScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      ) : needsRoleSelection || needsProfileSetup ? (
        <>
          <RootStack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="SeekerProfileSetup"
            component={SeekerProfileSetupScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="CompanyProfileSetup"
            component={CompanyProfileSetupScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="SkillsSelection"
            component={SkillsSelectionScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="CategorySelection"
            component={CategorySelectionScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <RootStack.Screen
            name="OnboardingSuccess"
            component={OnboardingSuccessScreen}
            options={{
              gestureEnabled: false,
            }}
          />
        </>
      ) : (
        <RootStack.Screen
          name="Main"
          component={MainNavigator}
          options={{
            gestureEnabled: false,
          }}
        />
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
  const [showSplash, setShowSplash] = useState(true);
  const [hasSplashShown, setHasSplashShown] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if splash has already been shown in this session
        const splashShownInSession = await AsyncStorage.getItem('splash_shown_session');
        const currentSession = Date.now().toString();
        const lastSession = await AsyncStorage.getItem('app_session_id');
        
        // If this is a new session (cold launch), show splash
        const isNewSession = !lastSession || (Date.now() - parseInt(lastSession)) > 30000; // 30 second threshold
        
        if (isNewSession && !splashShownInSession) {
          console.log('🚀 [App] Cold launch detected, showing splash screen');
          setShowSplash(true);
          await AsyncStorage.setItem('app_session_id', currentSession);
          await AsyncStorage.setItem('splash_shown_session', 'true');
        } else {
          setShowSplash(false);
          setHasSplashShown(true);
        }

        // Restore navigation state
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
      initializeApp();
    }
  }, [isReady]);

  const onStateChange = state => {
    AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  };

  const handleSplashFinish = () => {
    console.log('✅ [App] Splash screen finished');
    setShowSplash(false);
    setHasSplashShown(true);
  };

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <UserProvider>
            <ProfileProvider>
              {!isReady ? (
                <AppLoadingScreen />
              ) : showSplash && !hasSplashShown ? (
                <SplashScreen onFinish={handleSplashFinish} />
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
