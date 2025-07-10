import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';

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
    </ProfileSetupStack.Navigator>
  );
};

export default ProfileSetupNavigator; 