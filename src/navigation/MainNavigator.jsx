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
import OnboardingScreen from '../onboarding/screens/OnboardingScreen';
import SeekerProfileSetupScreen from '../profile/screens/SeekerProfileSetupScreen';
import CompanyProfileSetupScreen from '../profile/screens/CompanyProfileSetupScreen';
import SkillsSelectionScreen from '../profile/screens/SkillsSelectionScreen';
import CategorySelectionScreen from '../profile/screens/CategorySelectionScreen';
import JobBrowseScreen from '../jobs/screens/JobBrowseScreen';
import ApplicationDetailsScreen from '../jobs/screens/ApplicationDetailsScreen';
import ApplicationsReviewScreen from '../jobs/screens/ApplicationsReviewScreen';
import JobManagementScreen from '../jobs/screens/JobManagementScreen';

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
        name="JobsJobDetails"
        component={SwipeableJobDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobsSwipeableJobDetails"
        component={SwipeableJobDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobsApplicationDetails"
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
        name="MyJobsJobDetails"
        component={SwipeableJobDetailsScreen}
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

const JobManagementStack = () => {
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
        name="JobManagementMain"
        component={JobManagementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobManagementJobDetails"
        component={SwipeableJobDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const ApplicationsReviewStack = () => {
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
        name="ApplicationsReviewMain"
        component={ApplicationsReviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ApplicationsReviewApplicationDetails"
        component={ApplicationDetailsScreen}
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
  const auth = useAuth();

  // Safety check - return null if auth context is not ready
  if (!auth || !auth.userRoles) {
    return null;
  }

  // Determine if user is a poster (company) or seeker
  const isPoster = auth.userRoles?.isCompany || false;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Jobs') {
            iconName = 'briefcase';
          } else if (route.name === 'AppliedJobs') {
            iconName = 'file-text';
          } else if (route.name === 'JobManagement') {
            iconName = 'briefcase';
          } else if (route.name === 'ApplicationsReview') {
            iconName = 'users';
          } else if (route.name === 'MyJobs') {
            iconName = 'folder';
          } else if (route.name === 'CreateJob') {
            iconName = 'plus-circle';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={focused ? 24 : 22} color={color} />;
        },
        tabBarActiveTintColor: theme?.colors?.primary?.main || '#3C4FE0',
        tabBarInactiveTintColor: theme?.colors?.text?.secondary || '#475569',
        tabBarStyle: {
          backgroundColor: theme?.colors?.background?.secondary || '#FFFFFF',
          borderTopColor: theme?.colors?.interactive?.border?.primary || '#E2E8F0',
          borderTopWidth: 1,
          paddingTop: 12,
          paddingBottom: 12,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: 'System',
          marginTop: 2,
          letterSpacing: -0.1,
        },
        headerShown: false,
      })}
    >
      {isPoster ? (
        // Poster Navigation (4 tabs) - Full functionality
        <>
          <Tab.Screen
            name="Dashboard"
            component={DashboardStack}
            options={{
              tabBarLabel: 'Dashboard',
            }}
          />
          <Tab.Screen
            name="JobManagement"
            component={JobManagementStack}
            options={{
              tabBarLabel: 'Jobs',
            }}
          />
          <Tab.Screen
            name="ApplicationsReview"
            component={ApplicationsReviewStack}
            options={{
              tabBarLabel: 'Applications',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </>
      ) : (
        // Seeker Navigation (4 tabs) - Full functionality
        <>
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
              tabBarLabel: 'Applied',
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarLabel: 'Profile',
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainNavigator;
