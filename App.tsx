import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
