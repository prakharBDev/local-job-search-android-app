import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '../components/elements/Icon';
import { useTheme } from '../contexts/ThemeContext';

// Import screens
import DashboardScreen from '../dashboard/screens/DashboardScreen';
import IndexScreen from '../landingpage/screens/IndexScreen';
import MyJobsScreen from '../jobs/screens/MyJobsScreen';
import CreateJobScreen from '../jobs/screens/CreateJobScreen';
import ProfileScreen from '../profile/screens/ProfileScreen';
import ProfileSetupScreen from '../profile/screens/ProfileSetupScreen';
import EditProfileScreen from '../profile/screens/EditProfileScreen';
import JobDetailsScreen from '../jobs/screens/JobDetailsScreen';
import AppliedJobsScreen from '../jobs/screens/AppliedJobsScreen';
import OnboardingScreen from '../onboarding/screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack navigators for each tab
const DashboardStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text?.primary || '#1E293B',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const JobsStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text?.primary || '#1E293B',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="JobsMain"
        component={IndexScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MyJobsStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text?.primary || '#1E293B',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MyJobsMain"
        component={MyJobsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppliedJobs"
        component={AppliedJobsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const CreateJobStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text?.primary || '#1E293B',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="CreateJobMain"
        component={CreateJobScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text?.primary || '#1E293B',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Jobs') {
            iconName = 'briefcase';
          } else if (route.name === 'MyJobs') {
            iconName = 'folder';
          } else if (route.name === 'CreateJob') {
            iconName = 'plus-circle';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme?.colors?.primary?.main || '#3C4FE0',
        tabBarInactiveTintColor: theme?.colors?.text?.secondary || '#475569',
        tabBarStyle: {
          backgroundColor: theme?.colors?.background?.primary || '#FFFFFF',
          borderTopColor: theme?.colors?.border?.primary || '#E2E8F0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={JobsStack}
        options={{
          tabBarLabel: 'Jobs',
        }}
      />
      <Tab.Screen
        name="MyJobs"
        component={MyJobsStack}
        options={{
          tabBarLabel: 'My Jobs',
        }}
      />
      <Tab.Screen
        name="CreateJob"
        component={CreateJobStack}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
