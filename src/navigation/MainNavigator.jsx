import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Text } from 'react-native';

import AppliedJobsScreen from '../screens/AppliedJobsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BrowseJobsScreen from '../screens/JobDetailsScreen';

import { useUser } from '../contexts/UserContext';

import { theme } from '../theme';

const SeekerTab = createBottomTabNavigator();
const PosterTab = createBottomTabNavigator();

const SeekerTabIcon = ({ route, focused, color, size }) => {
  let iconText;

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
};

const getSeekerScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => (
    <SeekerTabIcon route={route} focused={focused} color={color} size={size} />
  ),
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
});

const SeekerTabNavigator = () => {
  return (
    <SeekerTab.Navigator screenOptions={getSeekerScreenOptions}>
      <SeekerTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <SeekerTab.Screen
        name="Browse Jobs"
        component={BrowseJobsScreen}
        options={{
          tabBarLabel: 'Browse Jobs',
        }}
      />
      <SeekerTab.Screen
        name="Profile"
        component={ProfileScreen}
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

const PosterTabIcon = ({ route, focused, color, size }) => {
  let iconText;

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
    case 'Browse Jobs':
      iconText = focused ? '🔍' : '🔍';
      break;
    default:
      iconText = '❓';
  }

  return <Text style={{ fontSize: size - 2, color }}>{iconText}</Text>;
};

const getPosterScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => (
    <PosterTabIcon route={route} focused={focused} color={color} size={size} />
  ),
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
});

const PosterTabNavigator = () => {
  return (
    <PosterTab.Navigator screenOptions={getPosterScreenOptions}>
      <PosterTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <PosterTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <PosterTab.Screen
        name="MyJobs"
        component={MyJobsScreen}
        options={{
          tabBarLabel: 'My Jobs',
        }}
      />
    </PosterTab.Navigator>
  );
};

const MainNavigator = () => {
  const { isSeekerMode } = useUser();

  return isSeekerMode ? <SeekerTabNavigator /> : <PosterTabNavigator />;
};

export default MainNavigator;
