import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon } from '../components/elements';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import DashboardScreen from '../dashboard/screens/DashboardScreen';
import MyJobsScreen from '../jobs/screens/MyJobsScreen';
import CreateJobScreen from '../jobs/screens/CreateJobScreen';
import ProfileScreen from '../profile/screens/ProfileScreen';
import ProfileSetupScreen from '../profile/screens/ProfileSetupScreen';
import EditProfileScreen from '../profile/screens/EditProfileScreen';
import SwipeableJobDetailsScreen from '../jobs/screens/SwipeableJobDetailsScreen';
import AppliedJobsScreen from '../jobs/screens/AppliedJobsScreen';
import OnboardingScreen from '../onboarding/screens/OnboardingScreen';
import SeekerProfileSetupScreen from '../profile/screens/SeekerProfileSetupScreen';
import CompanyProfileSetupScreen from '../profile/screens/CompanyProfileSetupScreen';
import SkillsSelectionScreen from '../profile/screens/SkillsSelectionScreen';
import CategorySelectionScreen from '../profile/screens/CategorySelectionScreen';
import JobBrowseScreen from '../jobs/screens/JobBrowseScreen';
import ApplicationDetailsScreen from '../jobs/screens/ApplicationDetailsScreen';

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
        component={JobBrowseScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetails"
        component={SwipeableJobDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SwipeableJobDetails"
        component={SwipeableJobDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApplicationDetails"
        component={ApplicationDetailsScreen}
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
        name="SeekerProfileSetup"
        component={SeekerProfileSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompanyProfileSetup"
        component={CompanyProfileSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SkillsSelection"
        component={SkillsSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategorySelection"
        component={CategorySelectionScreen}
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
  const { userRoles } = useAuth();

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
        tabBarActiveTintColor: theme?.colors?.primary?.main || '#6475f8', // New purple for active tab
        tabBarInactiveTintColor: theme?.colors?.secondary?.main || '#6B7280', // Gray for inactive
        tabBarStyle: {
          backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
          borderTopColor: theme?.colors?.border?.primary || '#E2E8F0',
          paddingTop: 8,
          paddingBottom: 8,
          height: 60, // Slightly taller for better visual balance
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600', // Bold for active tabs
          fontFamily: 'Inter',
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
          tabBarLabel: userRoles?.isCompany ? 'My Jobs' : 'Applications',
        }}
      />
      {/* Only show Create Job tab for companies/job posters */}
      {userRoles.isCompany && (
        <Tab.Screen
          name="CreateJob"
          component={CreateJobStack}
          options={{
            tabBarLabel: 'Create',
          }}
        />
      )}
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
