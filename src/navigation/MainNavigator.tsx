// Using text icons as placeholder - replace with react-native-vector-icons if available
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform } from 'react-native';

// Import navigation types
import type { PosterTabParamList, SeekerTabParamList } from '../types/navigation';

// Import screens
import AppliedJobsScreen from '../screens/AppliedJobsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HomeScreen from '../screens/HomeScreen';
import MyJobsScreenSimple from '../screens/MyJobsScreenSimple';
import SettingsScreen from '../screens/SettingsScreen';

// Import contexts
import { useUser } from '../contexts/UserContext';

// Import theme
import { theme } from '../theme';

// Create tab navigators
const SeekerTab = createBottomTabNavigator<SeekerTabParamList>();
const PosterTab = createBottomTabNavigator<PosterTabParamList>();

// Job Seeker Tab Navigator
const SeekerTabNavigator: React.FC = () => {
  return (
    <SeekerTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { Text } = require('react-native');
          let iconText: string;

          switch (route.name) {
            case 'Dashboard':
              iconText = focused ? '🏠' : '🏡';
              break;
            case 'Profile':
              iconText = focused ? '👤' : '👤';
              break;
            case 'AppliedJobs':
              iconText = focused ? '💼' : '💼';
              break;
            default:
              iconText = '❓';
          }

          return <Text style={{ fontSize: size - 2, color }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: theme.colors.primary.emerald,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerShown: false,
      })}>
      <SeekerTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <SeekerTab.Screen
        name="Profile"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <SeekerTab.Screen
        name="AppliedJobs"
        component={AppliedJobsScreen}
        options={{
          tabBarLabel: 'Applied Jobs',
        }}
      />
    </SeekerTab.Navigator>
  );
};

// Job Poster Tab Navigator
const PosterTabNavigator: React.FC = () => {
  return (
    <PosterTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { Text } = require('react-native');
          let iconText: string;

          switch (route.name) {
            case 'Dashboard':
              iconText = focused ? '🏠' : '🏡';
              break;
            case 'Profile':
              iconText = focused ? '👤' : '👤';
              break;
            case 'MyJobs':
              iconText = focused ? '🏢' : '🏢';
              break;
            default:
              iconText = '❓';
          }

          return <Text style={{ fontSize: size - 2, color }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: theme.colors.primary.emerald,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        headerShown: false,
      })}>
      <PosterTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <PosterTab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <PosterTab.Screen
        name="MyJobs"
        component={MyJobsScreenSimple}
        options={{
          tabBarLabel: 'My Jobs',
        }}
      />
    </PosterTab.Navigator>
  );
};

// Main Navigator that switches between seeker and poster tabs
const MainNavigator: React.FC = () => {
  const { isSeekerMode } = useUser();

  // Return the appropriate tab navigator based on user mode
  return isSeekerMode ? <SeekerTabNavigator /> : <PosterTabNavigator />;
};

export default MainNavigator;
