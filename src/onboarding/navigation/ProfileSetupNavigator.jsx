import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import SeekerProfileSetupScreen from '../../profile/screens/SeekerProfileSetupScreen';
import CompanyProfileSetupScreen from '../../profile/screens/CompanyProfileSetupScreen';
import SkillsSelectionScreen from '../../profile/screens/SkillsSelectionScreen';
import CategorySelectionScreen from '../../profile/screens/CategorySelectionScreen';

const ProfileSetupStack = createNativeStackNavigator();

const ProfileSetupNavigator = () => {
  return (
    <ProfileSetupStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileSetupStack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
      />
      <ProfileSetupStack.Screen
        name="SeekerProfileSetup"
        component={SeekerProfileSetupScreen}
      />
      <ProfileSetupStack.Screen
        name="CompanyProfileSetup"
        component={CompanyProfileSetupScreen}
      />
      <ProfileSetupStack.Screen
        name="SkillsSelection"
        component={SkillsSelectionScreen}
      />
      <ProfileSetupStack.Screen
        name="CategorySelection"
        component={CategorySelectionScreen}
      />
    </ProfileSetupStack.Navigator>
  );
};

export default ProfileSetupNavigator;
